import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from '../contexts/LanguageContext';
import { LanguageCode, supportedLanguages } from '../types';
import { useGeminiLive } from '../hooks/useGeminiLive';

interface LiveSessionProps {
  language: LanguageCode;
  onBackToDashboard: () => void;
}

type TranscriptItem = {
    speaker: 'user' | 'assistant';
    text: string;
};

// FIX: Moved the AIStudio interface into the global declaration to prevent potential scope conflicts
declare global {
    // A global declaration for the `aistudio` object on the window,
    // which is used for the mandatory API key selection flow.
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }

    interface Window {
        aistudio?: AIStudio;
    }
}

const LiveSession: React.FC<LiveSessionProps> = ({ language, onBackToDashboard }) => {
  const { t } = useTranslations();
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isApiKeySelected, setIsApiKeySelected] = useState(false);
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  // --- API Key Handling ---
  useEffect(() => {
      const checkApiKey = async () => {
          // FIX: Check if the API key is already available in the environment (e.g. Vercel).
          // We directly access process.env.API_KEY here to ensure the build tool can replace it.
          if (process.env.API_KEY) {
              setIsApiKeySelected(true);
              setIsCheckingApiKey(false);
              return;
          }

          if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
              const hasKey = await window.aistudio.hasSelectedApiKey();
              setIsApiKeySelected(hasKey);
          }
          setIsCheckingApiKey(false);
      };
      checkApiKey();
  }, []);

  const handleSelectKey = async () => {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
          await window.aistudio.openSelectKey();
          // Assume success to avoid race conditions, as per documentation.
          // The main initialization effect will now trigger.
          setIsApiKeySelected(true);
      }
  };

  const handleApiKeyError = useCallback(() => {
      // This callback is triggered by the useGeminiLive hook if a specific
      // "Requested entity was not found" error occurs, prompting the user to re-select.
      setIsApiKeySelected(false);
  }, []);

  // --- Gemini Live Hook Setup ---
  const handleTurnComplete = useCallback((userText: string, assistantText: string) => {
    setTranscript(prev => {
        const newTranscript = [...prev];
        if (userText) newTranscript.push({ speaker: 'user', text: userText });
        if (assistantText) newTranscript.push({ speaker: 'assistant', text: assistantText });
        return newTranscript;
    });
  }, []);

  // FIX: Use the full language name in the system prompt for clarity.
  const languageName = supportedLanguages[language] || 'English';
  const systemInstruction = `You are Lidia, a friendly and helpful AI communication coach. Keep your responses concise and encouraging. Conduct the entire conversation in ${languageName}.`;

  const { connectionState, startSession, stopSession, sendAudioData } = useGeminiLive(
    language,
    systemInstruction,
    handleTurnComplete,
    setIsAssistantSpeaking,
    false,
    handleApiKeyError
  );
  
  const sendAudioDataRef = useRef(sendAudioData);
  useEffect(() => {
    sendAudioDataRef.current = sendAudioData;
  }, [sendAudioData]);


  const handleEndSession = useCallback(() => {
    stopSession();
    onBackToDashboard();
  }, [stopSession, onBackToDashboard]);

  // --- Main Initialization Effect ---
  useEffect(() => {
    // Guard: Do not initialize until an API key is selected.
    if (!isApiKeySelected) {
      return;
    }

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const inputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        inputAudioContextRef.current = inputAudioContext;
        
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = scriptProcessor;

        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          sendAudioDataRef.current(inputData);
        };
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);

        startSession();

      } catch (error) {
        console.error("Failed to initialize live session media:", error);
      }
    };

    init();

    // Cleanup function
    return () => {
      stopSession();
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      scriptProcessorRef.current?.disconnect();
      if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        inputAudioContextRef.current.close();
      }
    };
  }, [isApiKeySelected, language, startSession, stopSession]);
  
   useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);


  const getStatusInfo = () => {
      const state = connectionState === 'idle' ? 'connecting' : connectionState;
      switch (state) {
          case 'connecting': return { text: t('live.session.connecting'), color: 'text-yellow-500', icon: <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>};
          case 'connected': return { text: t('live.session.connected'), color: 'text-green-500', icon: <span className="relative flex h-3 w-3 mr-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>};
          case 'error': return { text: t('live.session.error'), color: 'text-red-500', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>};
          case 'disconnected': return { text: t('live.session.disconnected'), color: 'text-gray-500', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>};
      }
      return { text: 'Unknown', color: 'text-gray-500', icon: null };
  };

  if (isCheckingApiKey) {
      return (
          <div className="flex flex-col items-center justify-center h-96">
              <svg className="animate-spin h-8 w-8 text-brand-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
      );
  }

  if (!isApiKeySelected) {
      return (
          <div className="max-w-xl mx-auto text-center bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">API Key Required</h2>
              <p className="text-gray-600 mb-6">Live Conversation with Lidia requires a Gemini API key. Please select a key to continue. For more information on billing, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">ai.google.dev/gemini-api/docs/billing</a>.</p>
              <button onClick={handleSelectKey} className="bg-brand-gold text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-transform hover:scale-105">
                  Select API Key
              </button>
          </div>
      );
  }

  const { text, color, icon } = getStatusInfo();

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200/50 flex flex-col h-[70vh]">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-brand-dark">{t('live.session.title')}</h2>
        <div className={`flex items-center text-sm font-semibold ${color}`}>
            {icon}
            {text}
        </div>
      </div>

      <div className="flex-grow p-6 overflow-y-auto space-y-6">
        {transcript.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.speaker === 'user' ? 'justify-end' : ''}`}>
            {msg.speaker === 'assistant' && (
              <img src={`https://picsum.photos/seed/LidiaAI/100/100`} alt="Lidia Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
            )}
            <div className={`max-w-md p-3 rounded-2xl ${msg.speaker === 'user' ? 'bg-brand-gold text-white rounded-br-none' : 'bg-gray-100 text-brand-dark rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
         {isAssistantSpeaking && (
          <div className="flex items-start gap-3">
            <img src={`https://picsum.photos/seed/LidiaAI/100/100`} alt="Lidia Avatar" className="w-8 h-8 rounded-full" />
            <div className="max-w-md p-3 rounded-2xl bg-gray-100 text-brand-dark rounded-bl-none">
              <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-brand-gold-dark rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-brand-gold-dark rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-brand-gold-dark rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 text-center border-t border-gray-100">
        <button onClick={handleEndSession} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
          {t('live.session.end')}
        </button>
      </div>
    </div>
  );
};

export default LiveSession;