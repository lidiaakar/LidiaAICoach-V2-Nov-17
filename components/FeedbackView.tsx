import React, { useRef, useState, useCallback, memo } from 'react';
import type { Feedback, FeedbackItem, Drill, LanguageCode } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { generateDynamicDrill } from '../services/geminiService';

interface FeedbackViewProps {
  feedback: Feedback | null;
  isLoading: boolean;
  onBackToDashboard: () => void;
  onStartDynamicDrill: (drill: Drill) => void;
  sessionVideoUrl: string | null;
  language: LanguageCode;
  error: string | null;
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
 * A loading component that shows a "Camera Off" overlay on the video.
 */
const LoadingView: React.FC<{ sessionVideoUrl: string | null }> = ({ sessionVideoUrl }) => {
    const { t } = useTranslations();
    return (
        <div className="text-center p-8 max-w-2xl mx-auto">
            <div className="relative mb-6">
                <video src={sessionVideoUrl || ''} muted className="w-full h-auto rounded-xl bg-black aspect-video opacity-50"></video>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/50 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l22 22" /></svg>
                    <span className="font-bold text-lg">{t('feedback.loading.cameraOff')}</span>
                </div>
            </div>
             <svg className="animate-spin h-10 w-10 text-brand-gold mb-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-brand-dark">{t('feedback.loading.title')}</h3>
            <p className="text-gray-600 mt-2">{t('feedback.loading.subtitle')}</p>
        </div>
    );
};

const FeedbackListItem = memo(({ item, onSeek }: { item: FeedbackItem, onSeek: (time: number) => void }) => {
    const { t } = useTranslations();
    const handleSeek = useCallback(() => {
        if (typeof item.timestamp === 'number') {
            onSeek(item.timestamp);
        }
    }, [item.timestamp, onSeek]);

    return (
        <li className="flex items-start gap-3 text-gray-700 leading-relaxed">
            <span className="flex-shrink-0 mt-1.5 text-brand-gold-dark">•</span>
            <div className="flex-grow">
                <span>{item.text}</span>
                {typeof item.timestamp === 'number' && (
                    <button onClick={handleSeek} className="ml-2 inline-flex items-center gap-1 text-xs bg-brand-gold/10 text-brand-gold-dark font-bold py-0.5 px-2 rounded-full hover:bg-brand-gold/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        {t('feedback.timestamp.goto', { time: new Date(item.timestamp * 1000).toISOString().substr(14, 5) })}
                    </button>
                )}
            </div>
        </li>
    );
});


/**
 * A reusable card component to display a category of feedback.
 */
// FIX: Updated the type of the `icon` prop to allow cloning with a `className` prop, resolving a TypeScript overload error.
const FeedbackCard: React.FC<{ title: string; items: FeedbackItem[]; icon: React.ReactElement<{ className?: string }>; onSeek: (time: number) => void;}> = ({ title, items, icon, onSeek }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/50 h-full">
            <div className="flex items-center gap-3 mb-4">
                {React.cloneElement(icon, { className: "h-6 w-6"})}
                <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
            </div>
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <FeedbackListItem key={index} item={item} onSeek={onSeek} />
                ))}
            </ul>
        </div>
    );
};

/**
 * A component to visualize a single performance score.
 */
const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
    const widthPercentage = Math.max(0, Math.min(100, score));
    let colorClass = 'bg-green-500';
    if (score < 40) {
        colorClass = 'bg-red-500';
    } else if (score < 70) {
        colorClass = 'bg-yellow-500';
    }

    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-brand-dark">{label}</span>
                <span className="font-bold text-lg text-brand-dark">{score}<span className="text-sm font-normal text-gray-500">/100</span></span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`${colorClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${widthPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${label} score: ${score} out of 100`}
                ></div>
            </div>
        </div>
    );
};

/**
 * The FeedbackView component displays the AI-generated feedback report after a session.
 */
const FeedbackView: React.FC<FeedbackViewProps> = ({ feedback, isLoading, onBackToDashboard, onStartDynamicDrill, sessionVideoUrl, language, error }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslations();
  const [isDrillLoading, setIsDrillLoading] = useState(false);
  const [drillError, setDrillError] = useState<string | null>(null);

  const handleSeekTo = useCallback((time: number) => {
    if (videoRef.current) {
        videoRef.current.currentTime = time;
        videoRef.current.play();
    }
  }, []);

  const handleGenerateDrill = useCallback(async () => {
    if (!feedback) return;

    setIsDrillLoading(true);
    setDrillError(null);
    try {
        const drill = await generateDynamicDrill(feedback.nextSteps, language);
        onStartDynamicDrill(drill);
    } catch (error) {
        console.error("Failed to generate dynamic drill:", error);
        setDrillError(error instanceof Error ? error.message : "Could not create a practice drill.");
    } finally {
        setIsDrillLoading(false);
    }
  }, [feedback, language, onStartDynamicDrill]);

  if (isLoading) {
    return <LoadingView sessionVideoUrl={sessionVideoUrl} />;
  }
  
  if (error || !feedback) {
      return (
          <div className="text-center p-8 max-w-2xl mx-auto">
              <ErrorDisplay message={error || t('feedback.error.message')} title={t('feedback.error.title')} />
              <button onClick={onBackToDashboard} className="mt-4 bg-brand-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-gold-dark transition-colors">
                  {t('feedback.button.back')}
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('feedback.title')}</h2>
        <p className="mt-3 text-lg text-gray-600">{t('feedback.intro')}</p>
      </div>

      {sessionVideoUrl && (
        <div>
            <h3 className="text-xl font-bold text-brand-dark mb-3 text-center">{t('feedback.video.title')}</h3>
            <div className="bg-black rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
                <video ref={videoRef} src={sessionVideoUrl} controls className="w-full h-auto"></video>
            </div>
        </div>
      )}

       <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/50">
          <h3 className="text-lg font-bold text-brand-dark mb-2">{t('feedback.summary')}</h3>
          <p className="text-gray-700">{feedback.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <FeedbackCard 
          title={t('feedback.keyTakeaways')}
          items={feedback.keyTakeaways}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-brand-gold-dark"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
          onSeek={handleSeekTo}
        />
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/50 space-y-4">
           <h3 className="text-lg font-bold text-brand-dark text-center mb-3">{t('feedback.performanceSnapshot')}</h3>
           <ScoreBar label={t('feedback.clarity')} score={feedback.performanceScores.clarity} />
           <ScoreBar label={t('feedback.confidence')} score={feedback.performanceScores.confidence} />
           <ScoreBar label={t('feedback.engagement')} score={feedback.performanceScores.engagement} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeedbackCard 
              title={t('feedback.messageAnalysis')}
              items={feedback.messageAnalysis}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>}
              onSeek={handleSeekTo}
          />
          <FeedbackCard 
              title={t('feedback.deliveryAnalysis')}
              items={feedback.deliveryAnalysis}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>}
              onSeek={handleSeekTo}
          />
          <FeedbackCard 
              title={t('feedback.presenceAnalysis')}
              items={feedback.presenceAnalysis}
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-teal-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.563V9.75m6-1.5v.188" /></svg>}
              onSeek={handleSeekTo}
          />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FeedbackCard 
            title={t('feedback.wins')} 
            items={feedback.wins}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            onSeek={handleSeekTo}
        />
        <FeedbackCard 
            title={t('feedback.nextSteps')}
            items={feedback.nextSteps}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-amber-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            onSeek={handleSeekTo}
        />
      </div>
      
       {feedback.personaFeedback && feedback.personaFeedback.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/50">
            <div className="flex items-center gap-3 mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <h3 className="text-lg font-bold text-brand-dark">{t('feedback.personaFeedback')}</h3>
            </div>
            <ul className="space-y-4">
                {feedback.personaFeedback.map((item, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-bold text-brand-dark mb-1">{item.persona}</p>
                        <div className="text-gray-700 flex items-start justify-between gap-2">
                           <span className="flex-grow">{item.feedback}</span>
                            {typeof item.timestamp === 'number' && (
                                <button onClick={() => handleSeekTo(item.timestamp!)} className="flex-shrink-0 inline-flex items-center gap-1 text-xs bg-brand-gold/10 text-brand-gold-dark font-bold py-0.5 px-2 rounded-full hover:bg-brand-gold/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                    {t('feedback.timestamp.goto', { time: new Date(item.timestamp * 1000).toISOString().substr(14, 5) })}
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      )}

      {feedback.materialAlignment && feedback.materialAlignment.length > 0 && (
            <FeedbackCard 
                title={t('feedback.materialAlignment')}
                items={feedback.materialAlignment}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                onSeek={handleSeekTo}
            />
      )}
      
      <div className="mt-12 text-center space-y-4">
        {drillError && <p className="text-red-500">{drillError}</p>}
        <button
            onClick={handleGenerateDrill}
            disabled={isDrillLoading}
            className="bg-brand-gold/20 text-brand-gold-dark font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-gold/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
            {isDrillLoading ? t('feedback.button.drillLoading') : t('feedback.button.drill')}
        </button>

        <button
          onClick={onBackToDashboard}
          className="bg-brand-gold text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-transform hover:scale-105"
        >
          {t('feedback.button.back')}
        </button>
      </div>
    </div>
  );
};

export default FeedbackView;