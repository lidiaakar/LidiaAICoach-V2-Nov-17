import { useState, useEffect, useCallback, useRef } from 'react';
import { LanguageCode } from '../types';

// FIX: Add types for the Web Speech API to the global window object.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/**
 * A custom hook to manage browser-based speech recognition.
 * @param language The language for speech recognition.
 * @param onResult Callback for final speech recognition results.
 * @param onSpeakingEnd Callback for when the user stops speaking.
 * @param onLiveTranscript Callback for live, interim speech recognition results.
 * @returns An object with state and functions to control speech recognition.
 */
export const useVoiceChat = (
  language: LanguageCode,
  onResult: (transcript: string) => void,
  onSpeakingEnd?: () => void,
  onLiveTranscript?: (transcript: string) => void,
) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (onLiveTranscript && interimTranscript) {
          onLiveTranscript(interimTranscript);
        }
        
        if (finalTranscript) {
          onResult(finalTranscript.trim());
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
        if (onSpeakingEnd) {
          onSpeakingEnd();
        }
      };

      recognition.onerror = (event: any) => {
        // Gracefully handle common non-critical events. 'aborted' can be triggered
        // by `recognition.stop()`, and 'no-speech' is a timeout.
        if (event.error === 'aborted' || event.error === 'no-speech') {
          console.info(`Speech recognition gracefully stopped: ${event.error}`);
          // The 'onend' event will fire next to clean up state.
          return;
        }

        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    // Cleanup on unmount
    return () => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch(e) { /* ignore */ }
        }
    }
  }, [language, onResult, onLiveTranscript, onSpeakingEnd]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        // Catch DOMException: "recognition has already started" which can happen in some cases.
        if (e instanceof DOMException && e.name === 'InvalidStateError') {
             console.warn("Speech recognition attempted to start while already running.");
        } else {
             console.error("Speech recognition start error:", e);
        }
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        // onend callback will set isListening to false
      } catch (e) {
        console.error("Speech recognition stop error:", e);
        setIsListening(false); // Force state change on error
      }
    }
  }, [isListening]);

  return { isListening, isSupported, startListening, stopListening };
};