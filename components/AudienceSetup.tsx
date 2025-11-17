import React, { useState, useCallback } from 'react';
import { useTranslations } from '../contexts/LanguageContext';

interface AudienceSetupProps {
  onComplete: (audience: string) => void;
  onBackToDashboard: () => void;
}

/**
 * The AudienceSetup component allows users to define their target audience
 * before a practice session to get more tailored, persona-based feedback.
 */
const AudienceSetup: React.FC<AudienceSetupProps> = ({ onComplete, onBackToDashboard }) => {
    const { t } = useTranslations();
    const [audience, setAudience] = useState('');

    const handleComplete = useCallback(() => {
        onComplete(audience);
    }, [audience, onComplete]);

    const handleSkip = useCallback(() => {
        onComplete('');
    }, [onComplete]);

    return (
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('audience.setup.title')}</h2>
            <p className="mt-3 text-lg text-gray-600">{t('audience.setup.intro')}</p>
            
            <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200/50">
                <label htmlFor="audience-description" className="sr-only">{t('audience.setup.title')}</label>
                <textarea
                    id="audience-description"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder={t('audience.setup.placeholder')}
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition resize-y"
                    aria-label="Audience Description"
                />

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={handleComplete} 
                        className="bg-brand-gold text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-transform hover:scale-105 w-full sm:w-auto"
                    >
                        {t('audience.setup.button.start')}
                    </button>
                    <button 
                        onClick={handleSkip} 
                        className="text-brand-dark font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition w-full sm:w-auto"
                    >
                        {t('audience.setup.button.skip')}
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <button onClick={onBackToDashboard} className="text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t('button.backToDashboard')}
                </button>
            </div>
        </div>
    );
};

export default AudienceSetup;