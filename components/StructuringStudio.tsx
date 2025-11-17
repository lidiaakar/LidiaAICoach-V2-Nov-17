import React, { useState, useCallback } from 'react';
import { useTranslations } from '../contexts/LanguageContext';
import { structureText, findSupportingStat } from '../services/geminiService';
import { LanguageCode } from '../types';
import { useVoiceChat } from '../hooks/useVoiceChat';

interface StructuringStudioProps {
  language: LanguageCode;
  onBackToDashboard: () => void;
  onProceedToSession: () => void;
}

type StructureFormat = 'organize' | 'star' | 'core';

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

// Microphone Icon Component
const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
    </svg>
);


/**
 * The StructuringStudio component provides a dedicated workspace for users to
 * organize their thoughts with AI assistance before a practice session.
 */
const StructuringStudio: React.FC<StructuringStudioProps> = ({ language, onBackToDashboard, onProceedToSession }) => {
  const { t } = useTranslations();
  // --- STATE ---
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStatLoading, setIsStatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{ stat: string; source: string } | null>(null);

  // --- Voice Input State ---
  const [liveTranscript, setLiveTranscript] = useState('');

  /**
   * Appends the finalized transcript chunk from speech recognition to the main input text.
   */
  const handleSpeechResult = useCallback((transcript: string) => {
    if (transcript) {
        // Use functional update to correctly append to the previous state.
        setInputText(prev => (prev + (prev ? ' ' : '') + transcript).trim());
    }
    // Clear the live transcript view since this portion is now final.
    setLiveTranscript('');
  }, []);
  
  /**
   * Updates the state with the interim, real-time transcript from speech recognition.
   */
  const handleLiveTranscript = useCallback((transcript: string) => {
    setLiveTranscript(transcript);
  }, []);

  // FIX: Created a stable callback for onSpeakingEnd to prevent the useVoiceChat hook
  // from re-initializing on every render, which was breaking the dictation feature.
  const handleSpeakingEnd = useCallback(() => {
    setLiveTranscript('');
  }, []);

  const { isListening, isSupported, startListening, stopListening } = useVoiceChat(
    language,
    handleSpeechResult,
    handleSpeakingEnd,
    handleLiveTranscript
  );

  /**
   * Toggles the voice dictation on and off.
   */
  const handleToggleDictation = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      setLiveTranscript('');
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  /**
   * Handles the click of an AI action button. It calls the Gemini service
   * to refine the user's input text based on the selected format.
   * @param format The structuring format to apply (e.g., 'organize', 'star').
   */
  const handleStructureRequest = useCallback(async (format: StructureFormat) => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setOutputText(''); // Clear previous output
    setSuggestion(null);

    try {
      const prompt = t(`studio.prompt.${format}`);
      const result = await structureText(inputText, prompt, language);
      setOutputText(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(message);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, language, t]);
  
  /**
   * Handles the click of the "Find Supporting Stat" button.
   */
  const handleFindStat = useCallback(async () => {
      if (!inputText.trim()) return;
      setIsStatLoading(true);
      setError(null);
      setSuggestion(null);
      try {
        const result = await findSupportingStat(inputText, language);
        setSuggestion(result);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(message);
      } finally {
        setIsStatLoading(false);
      }
  }, [inputText, language]);

  /**
   * Appends the suggested statistic to the user's input notes.
   */
  const handleAddStatToNotes = useCallback(() => {
    if (suggestion) {
        setInputText(prev => `${prev}\n\n- ${suggestion.stat} (Source: ${suggestion.source})`);
        setSuggestion(null);
    }
  }, [suggestion]);

  const handleOrganizeClick = useCallback(() => handleStructureRequest('organize'), [handleStructureRequest]);
  const handleStarClick = useCallback(() => handleStructureRequest('star'), [handleStructureRequest]);
  const handleCoreClick = useCallback(() => handleStructureRequest('core'), [handleStructureRequest]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('studio.title')}</h2>
        <p className="mt-3 text-lg text-gray-600">{t('studio.intro')}</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200/50">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Area */}
          <div>
            <textarea
              // Display the combination of finalized text and live, in-progress transcript.
              value={`${inputText}${inputText ? ' ' : ''}${liveTranscript}`.trim()}
              onChange={(e) => {
                  if (!isListening) {
                      setInputText(e.target.value);
                  }
              }}
              disabled={isListening}
              placeholder={t('studio.input.placeholder')}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          {/* Output Area */}
          <div className="relative">
            <textarea
              value={outputText}
              readOnly
              placeholder={t('studio.output.placeholder')}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-2 text-brand-dark font-semibold">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('studio.button.loading')}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* AI Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-gray-200 pt-6">
          {isSupported && (
            <button 
                onClick={handleToggleDictation} 
                disabled={isLoading || isStatLoading} 
                className={`font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center gap-2 ${isListening ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20 animate-pulse' : 'bg-brand-gold/10 text-brand-gold-dark hover:bg-brand-gold/20'}`}
            >
                <MicIcon className="h-5 w-5" />
                {t(isListening ? 'studio.button.dictating' : 'studio.button.dictate')}
            </button>
          )}
          <button onClick={handleOrganizeClick} disabled={isLoading || isStatLoading || !inputText} className="bg-brand-gold/10 text-brand-gold-dark font-semibold py-2 px-4 rounded-lg hover:bg-brand-gold/20 transition disabled:opacity-50">
            {t('studio.button.organize')}
          </button>
          <button onClick={handleStarClick} disabled={isLoading || isStatLoading || !inputText} className="bg-brand-gold/10 text-brand-gold-dark font-semibold py-2 px-4 rounded-lg hover:bg-brand-gold/20 transition disabled:opacity-50">
            {t('studio.button.star')}
          </button>
          <button onClick={handleCoreClick} disabled={isLoading || isStatLoading || !inputText} className="bg-brand-gold/10 text-brand-gold-dark font-semibold py-2 px-4 rounded-lg hover:bg-brand-gold/20 transition disabled:opacity-50">
            {t('studio.button.core')}
          </button>
          <button onClick={handleFindStat} disabled={isLoading || isStatLoading || !inputText} className="bg-blue-500/10 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-500/20 transition disabled:opacity-50 flex items-center gap-2">
            {isStatLoading ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" /></svg>}
            {t('studio.button.findStat')}
          </button>
        </div>

        {error && <div className="mt-4"><ErrorDisplay message={error} /></div>}
        {suggestion && (
            <div className="mt-6 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20 text-center">
                <p className="text-brand-dark">"{suggestion.stat}"</p>
                <p className="text-xs text-gray-500 mt-1">{t('studio.stat.source', { source: suggestion.source })}</p>
                <button onClick={handleAddStatToNotes} className="mt-3 bg-blue-500 text-white font-semibold py-1 px-3 rounded-lg text-sm hover:bg-blue-600 transition">
                    {t('studio.button.addStat')}
                </button>
            </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={onBackToDashboard} className="text-brand-dark font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition w-full sm:w-auto">
            &larr; {t('feedback.button.back')}
        </button>
        <button onClick={onProceedToSession} className="bg-brand-gold text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-transform hover:scale-105 w-full sm:w-auto">
            {t('studio.button.proceed')}
        </button>
      </div>
    </div>
  );
};

export default StructuringStudio;