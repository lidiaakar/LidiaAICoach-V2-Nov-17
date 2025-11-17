import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import type { LanguageCode } from '../types';
import { getAiInstance } from '../services/geminiService';

// --- Audio Encoding/Decoding Helpers ---
// These functions are crucial for converting audio between the browser's format and the Base64 format required by the Gemini Live API.
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    // The Gemini Live API requires raw PCM audio at a 16000Hz sample rate.
    mimeType: 'audio/pcm;rate=16000',
  };
}
// --- End Helpers ---


/**
 * A custom hook to manage a real-time, streaming voice conversation with the Gemini Live API.
 * @param language The language for the session.
 * @param systemInstruction The system prompt to guide the AI's behavior.
 * @param onTurnComplete A callback fired when a full user/assistant turn is transcribed.
 * @param onAssistantSpeakingStateChange A callback to notify the UI when the AI starts or stops speaking.
 * @param transcriptionOnly A flag to enable a mode where only transcription is performed and no audio is played back.
 * @param onApiKeyError An optional callback to signal a specific API key-related error.
 * @param onLiveTranscript An optional callback that streams the user's in-progress speech.
 * @returns An object with state and functions to control the live session.
 */
export const useGeminiLive = (
  language: LanguageCode,
  systemInstruction: string,
  onTurnComplete: (user: string, assistant: string) => void,
  onAssistantSpeakingStateChange: (isSpeaking: boolean) => void,
  transcriptionOnly: boolean = false,
  onApiKeyError?: () => void,
  onLiveTranscript?: (transcript: string) => void
) => {
  const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected' | 'error' | 'disconnected'>('idle');
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  
  // FIX: Group audio-related refs into a single, stable ref object to prevent them from becoming dependencies.
  const audioRefs = useRef({
      outputAudioContext: null as AudioContext | null,
      sources: new Set<AudioBufferSourceNode>(),
      nextStartTime: 0,
  }).current;

  // FIX: Use a ref to store all dynamic props and state. This allows the callbacks (`startSession`, etc.)
  // to be stable (created only once) while still accessing the latest values from props and state.
  const paramsRef = useRef({
    language,
    systemInstruction,
    onTurnComplete,
    onAssistantSpeakingStateChange,
    transcriptionOnly,
    onApiKeyError,
    onLiveTranscript,
    connectionState,
  });

  // Update the ref on every render to ensure callbacks have access to the latest values.
  useEffect(() => {
    paramsRef.current = {
      language,
      systemInstruction,
      onTurnComplete,
      onAssistantSpeakingStateChange,
      transcriptionOnly,
      onApiKeyError,
      onLiveTranscript,
      connectionState,
    };
  });
  
  // Initialize the output AudioContext on mount.
  useEffect(() => {
    if (!paramsRef.current.transcriptionOnly) {
        audioRefs.outputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    }
    
    return () => {
      // Clean up the audio context when the component unmounts.
      if (audioRefs.outputAudioContext && audioRefs.outputAudioContext.state !== 'closed') {
        audioRefs.outputAudioContext.close();
      }
    };
  }, [audioRefs]); // `transcriptionOnly` should not change, so this runs once.

  // FIX: Make `stopSession` stable by removing all dependencies. It now reads everything from refs.
  const stopSession = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close()).catch(e => console.error("Error closing session:", e));
        // The onclose callback will nullify the ref.
    }
    
    // Stop and clear any currently playing audio.
    for (const source of audioRefs.sources.values()) {
        source.stop();
    }
    audioRefs.sources.clear();
    audioRefs.nextStartTime = 0;
    paramsRef.current.onAssistantSpeakingStateChange(false);
    setConnectionState('idle'); // Set to idle so it can be started again
  }, [audioRefs]);

  // FIX: Make `startSession` stable by removing all dependencies.
  const startSession = useCallback(async () => {
    if (sessionPromiseRef.current) {
        return;
    }
    
    setConnectionState('connecting');
    let currentInputTranscription = '';
    let currentOutputTranscription = '';
    
    try {
        const ai = getAiInstance();
        const promise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => setConnectionState('connected'),
            onmessage: async (message: LiveServerMessage) => {
              // Read latest callbacks and state from the ref.
              const { onLiveTranscript, onTurnComplete, onAssistantSpeakingStateChange, transcriptionOnly } = paramsRef.current;
              
              // --- Handle Transcription ---
              if (message.serverContent?.outputTranscription) {
                currentOutputTranscription += message.serverContent.outputTranscription.text;
              } else if (message.serverContent?.inputTranscription) {
                const text = message.serverContent.inputTranscription.text;
                currentInputTranscription += text;
                onLiveTranscript?.(text); // Fire the live transcript callback
              }
    
              if (message.serverContent?.turnComplete) {
                onTurnComplete(currentInputTranscription.trim(), currentOutputTranscription.trim());
                currentInputTranscription = '';
                currentOutputTranscription = '';
              }
              
              // --- Handle Audio Playback ---
              if (!transcriptionOnly) {
                  const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                  const outputCtx = audioRefs.outputAudioContext;
        
                  if (base64Audio && outputCtx) {
                    onAssistantSpeakingStateChange(true);
                    audioRefs.nextStartTime = Math.max(audioRefs.nextStartTime, outputCtx.currentTime);
                    const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                    const sourceNode = outputCtx.createBufferSource();
                    sourceNode.buffer = audioBuffer;
                    sourceNode.connect(outputCtx.destination);
                    
                    sourceNode.addEventListener('ended', () => {
                      audioRefs.sources.delete(sourceNode);
                      // If this was the last audio chunk, notify that speaking has stopped.
                      if (audioRefs.sources.size === 0) {
                        onAssistantSpeakingStateChange(false);
                      }
                    });
                    
                    sourceNode.start(audioRefs.nextStartTime);
                    audioRefs.nextStartTime += audioBuffer.duration;
                    audioRefs.sources.add(sourceNode);
                  }
              }
    
              // Handle interruptions from the user.
              if (message.serverContent?.interrupted && !transcriptionOnly) {
                for (const source of audioRefs.sources.values()) {
                  source.stop();
                  audioRefs.sources.delete(source);
                }
                audioRefs.nextStartTime = 0;
                onAssistantSpeakingStateChange(false);
              }
            },
            onerror: (e: ErrorEvent) => {
              console.error('Live session error:', e);
              const { onApiKeyError } = paramsRef.current;
              if (e.message && e.message.includes("Requested entity was not found.")) {
                onApiKeyError?.();
              }
              if (!navigator.onLine) {
                  console.error("Network error may be due to the user being offline.");
              }
              setConnectionState('error');
            },
            onclose: (e: CloseEvent) => {
              sessionPromiseRef.current = null;
              setConnectionState('disconnected');
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            // Read latest props from ref at the time of connection.
            systemInstruction: paramsRef.current.transcriptionOnly
                ? `You are a silent transcription assistant. Your only role is to listen to the user and transcribe their speech. Do not generate any spoken response.`
                : paramsRef.current.systemInstruction,
          },
        });
        sessionPromiseRef.current = promise;
    } catch (error) {
        console.error("Failed to initialize Gemini Live session:", error);
        setConnectionState('error');
        // If the error is an API key error, trigger the specific handler.
        if (error instanceof Error && error.message.includes("API_KEY")) {
            paramsRef.current.onApiKeyError?.();
        }
    }
  }, [audioRefs]); // `audioRefs` is stable, so this function is now stable.
  
  // FIX: Make `sendAudioData` stable.
  const sendAudioData = useCallback((audioData: Float32Array) => {
    // Read the latest connection state from the ref.
    if (paramsRef.current.connectionState !== 'connected') return;
    
    const pcmBlob = createBlob(audioData);
    sessionPromiseRef.current?.then((session) => {
      session.sendRealtimeInput({ media: pcmBlob });
    });
  }, []); // No dependencies, so this function is stable.

  // FIX: Make `playAudioData` stable.
  const playAudioData = useCallback(async (base64Audio: string): Promise<void> => {
    const outputCtx = audioRefs.outputAudioContext;
    const { onAssistantSpeakingStateChange } = paramsRef.current;
    if (!base64Audio || !outputCtx) return;
    
    onAssistantSpeakingStateChange(true);

    return new Promise(async (resolve) => {
        const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
        const sourceNode = outputCtx.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.connect(outputCtx.destination);
        
        sourceNode.addEventListener('ended', () => {
            onAssistantSpeakingStateChange(false);
            resolve();
        });
        sourceNode.start();
    });
  }, [audioRefs]); // `audioRefs` is stable.


  return { connectionState, startSession, stopSession, sendAudioData, playAudioData };
};
