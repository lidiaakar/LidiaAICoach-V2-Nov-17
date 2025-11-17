import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Drill, LanguageCode } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { generateDrillFeedback } from '../services/geminiService';
import { useGeminiLive } from '../hooks/useGeminiLive';

// Defines the possible states of the drill session component.
type DrillState = 'idle' | 'preparing' | 'recording' | 'loading' | 'feedback';

interface DrillSessionProps {
  drill: Drill;
  language: LanguageCode;
  onBackToDrills: () => void;
}


// Reusable Error Display Component
const ErrorDisplay: React.FC<{ message: string; onRetry?: () => void; title?: string;}> = ({ message, onRetry, title = "An Error Occurred" }) => (
    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-center my-4" role="alert">
      <div className="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-semibold mb-2">{title}</p>
        <p className="text-sm mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
);

/**
 * The DrillSession component provides a self-contained UI for a single,
 * focused micro-practice drill. It manages its own state for recording,
 * loading, and displaying instant, targeted feedback.
 */
const DrillSession: React.FC<DrillSessionProps> = ({ drill, language, onBackToDrills }) => {
  const { t } = useTranslations();
  // --- STATE ---
  const [drillState, setDrillState] = useState<DrillState>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState(drill.duration || 0);

  // --- REFS ---
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finalTranscriptRef = useRef('');
  const countdownIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // NEW REFS FOR AUDIO PIPELINE
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  
  // NEW: useGeminiLive hook for transcription
  const handleTurnComplete = useCallback((userText: string, assistantText: string) => {
    // In a drill, we only care about the user's speech. 
    // `turnComplete` might fire on pauses, so we append.
    if (userText) {
        finalTranscriptRef.current += userText + ' ';
    }
  }, []);
  
  // FIX: Create a stable callback function for onAssistantSpeakingStateChange.
  // The inline function `() => {}` was creating a new function on every render,
  // causing the useGeminiLive hook to return a new `stopSession` function,
  // which in turn caused the main setup/teardown useEffect to run its cleanup
  // on every render, prematurely clearing the countdown timer.
  const handleAssistantSpeakingStateChange = useCallback(() => {
    // This drill is transcription-only, so this function does nothing.
    // It just needs to be stable to prevent re-renders.
  }, []);

  const { startSession, stopSession, sendAudioData } = useGeminiLive(
    language,
    '', // System instruction is not needed for transcription only mode
    handleTurnComplete,
    handleAssistantSpeakingStateChange, // Use the stable function
    true // Enable transcription-only mode
  );
  
  const sendAudioDataRef = useRef(sendAudioData);
  useEffect(() => {
    sendAudioDataRef.current = sendAudioData;
  }, [sendAudioData]);


  // This useEffect runs only once on mount to set up media and the audio pipeline.
  useEffect(() => {
    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Audio pipeline setup
        const context = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = context;
        const sourceNode = context.createMediaStreamSource(stream);
        
        mediaStreamDestinationRef.current = context.createMediaStreamDestination();
        sourceNode.connect(mediaStreamDestinationRef.current);

        const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = scriptProcessor;
        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            sendAudioDataRef.current(inputData);
        };
        sourceNode.connect(scriptProcessor);
        scriptProcessor.connect(context.destination);
        
        setIsMediaReady(true);
      } catch (err) {
        console.error("Error accessing media devices.", err);
        setError("Could not access camera or microphone.");
      }
    };

    setup();

    // Main cleanup function for when the component unmounts
    return () => {
      stopSession(); // Clean up Gemini Live session
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      scriptProcessorRef.current?.disconnect();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [language, stopSession]);


  const handleStop = useCallback(() => {
    // 1. Stop UI timers and local recording
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    
    // 2. Change state to loading
    setDrillState('loading');
      
    // 3. Wait for a grace period for the final transcription to arrive from Gemini Live.
    //    The live session is still open during this time. Silence will be sent, which
    //    should trigger a 'turnComplete' from the server.
    setTimeout(() => {
        // 4. Now, stop the Gemini Live session.
        stopSession(); 
        
        // 5. Get the transcript that has been accumulated.
        const transcript = finalTranscriptRef.current.trim();
        if (!transcript) {
            setFeedback("No speech was detected.");
            setDrillState('feedback');
            return;
        }
        
        // 6. Asynchronously generate feedback from the transcript.
        (async () => {
            try {
              const drillPrompt = drill.feedbackPrompt || t(drill.promptKey!);
              const fb = await generateDrillFeedback(transcript, drillPrompt, language);
              setFeedback(fb);
              setError(null);
            } catch (e) {
              console.error(e);
              setError(e instanceof Error ? e.message : "Sorry, I couldn't generate feedback at this time.");
              setFeedback('');
            } finally {
                // 7. Once feedback is generated (or failed), update state.
                setDrillState('feedback');
            }
        })();

    }, 2000); // 2-second grace period for transcription.

  }, [drill, language, t, stopSession]);

  const handleStart = useCallback(() => {
    if (mediaStreamRef.current) {
        finalTranscriptRef.current = '';
        setDrillState('preparing');
        setCountdown(3);
    }
  }, []);

  useEffect(() => {
    if (drillState === 'preparing') {
        countdownIntervalRef.current = window.setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownIntervalRef.current!);
                    setDrillState('recording');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => {
        if(countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [drillState]);

  useEffect(() => {
    if (drillState === 'recording' && mediaStreamRef.current) {
        const videoTracks = mediaStreamRef.current.getVideoTracks();
        const audioStreamFromHub = mediaStreamDestinationRef.current?.stream;
        
        if (videoTracks?.length && audioStreamFromHub) {
            const audioTracks = audioStreamFromHub.getAudioTracks();
            if (audioTracks.length) {
                const streamForRecorder = new MediaStream([...videoTracks, ...audioTracks]);
                const recorder = new MediaRecorder(streamForRecorder);
                mediaRecorderRef.current = recorder;
                recorder.start();
                startSession(); // Start transcription session
            }
        }

        const duration = drill.duration;
        if (duration) {
            setTimer(duration);
            timerIntervalRef.current = window.setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current!);
                        handleStop();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }
    return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, [drillState, drill.duration, handleStop, startSession]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200/50 flex flex-col p-6">
      <h2 className="text-2xl font-bold text-center text-brand-dark mb-4">{t('drill.session.title', { drillTitle: drill.title || t(drill.titleKey!) })}</h2>
      
      <div className="relative mb-4">
        <video ref={videoRef} autoPlay muted className="w-full h-auto rounded-lg bg-black aspect-video"></video>
        {drillState === 'preparing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
            <div className="text-white text-6xl font-bold">
              {countdown > 0 ? countdown : t('drill.session.go')}
            </div>
          </div>
        )}
        {drillState === 'recording' && drill.duration && (
          <div className="absolute top-4 right-4 bg-black/50 text-white font-mono text-2xl px-3 py-1 rounded-lg">
            {timer}
          </div>
        )}
      </div>

      {(drillState === 'idle' || drillState === 'preparing' || drillState === 'recording') && (
        <div className="text-center p-4 bg-gray-50 rounded-lg min-h-[150px] flex flex-col justify-center">
            <h3 className="font-bold text-lg mb-2">{t('drill.session.instructions')}</h3>
            <p className="text-gray-700 mb-2">{drill.description || t(drill.descriptionKey!)}</p>
            {drill.contentKey && <p className="italic text-gray-600 p-2 border-l-4 border-brand-gold bg-brand-gold/5">"{t(drill.contentKey)}"</p>}
        </div>
      )}

      {(drillState === 'loading' || drillState === 'feedback') && (
        <div className="text-center p-4 bg-gray-50 rounded-lg min-h-[150px] flex flex-col justify-center">
            {drillState === 'loading' && (
                <>
                    <svg className="animate-spin h-8 w-8 text-brand-gold mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-semibold">{t('drill.session.loading')}</p>
                </>
            )}
            {drillState === 'feedback' && (
                <>
                    <h3 className="font-bold text-lg mb-2">{t('drill.session.feedbackTitle')}</h3>
                    {error ? <ErrorDisplay message={error} onRetry={handleStop} /> : <p className="text-gray-700 whitespace-pre-wrap">{feedback}</p>}
                </>
            )}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        {drillState === 'idle' && (
          <button onClick={handleStart} disabled={!isMediaReady} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            {t('drill.session.start')}
          </button>
        )}
        {drillState === 'recording' && (
          <button onClick={handleStop} className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-red-700 transition">
            {t('drill.session.stop')}
          </button>
        )}
        {drillState === 'feedback' && (
          <button onClick={handleStart} className="bg-brand-gold text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-gold-dark transition">
            {t('drill.session.tryAgain')}
          </button>
        )}
         <button onClick={onBackToDrills} className="text-brand-dark font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            {t('drill.session.backToDrills')}
        </button>
      </div>
    </div>
  );
};

export default DrillSession;