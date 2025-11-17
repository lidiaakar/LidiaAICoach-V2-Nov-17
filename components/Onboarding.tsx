import React, { useState, useCallback, useMemo } from 'react';
import type { UserData, LanguageCode, CoachingPlan } from '../types';
import { supportedLanguages } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { generateCoachingPlan } from '../services/geminiService';

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


interface OnboardingProps {
  onComplete: (data: UserData, plan: CoachingPlan) => void;
}

/**
 * The Onboarding component collects initial user data to generate a personalized plan.
 * @param {OnboardingProps} props - The component props.
 * @param {function} props.onComplete - Callback to pass the collected UserData to the App component.
 */
const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  // State for the form fields.
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [challenge, setChallenge] = useState('');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLanguage: setGlobalLanguage, t } = useTranslations();

  // Predefined goal options, translated and memoized to avoid re-creation on re-renders.
  const goals = useMemo(() => [
    { key: 'onboarding.goal.option1', value: t('onboarding.goal.option1')},
    { key: 'onboarding.goal.option2', value: t('onboarding.goal.option2')},
    { key: 'onboarding.goal.option3', value: t('onboarding.goal.option3')},
    { key: 'onboarding.goal.option4', value: t('onboarding.goal.option4')},
    { key: 'onboarding.goal.option5', value: t('onboarding.goal.option5')}
  ], [t]);

  /**
   * Handles changes to the language dropdown.
   * Updates both the local component state and the global language context.
   */
  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as LanguageCode;
    setLanguage(newLang);
    setGlobalLanguage(newLang);
  }, [setGlobalLanguage]);
  
  /**
   * Executes the asynchronous onboarding logic, including the API call.
   * This is separated to be used by both the form submit and the retry button.
   */
  const executeOnboarding = useCallback(async () => {
    if (!name || !goal || !challenge) return;

    setIsLoading(true);
    setError(null);
    const userData = { name, goal, challenge, language };

    try {
      const plan = await generateCoachingPlan(userData);
      onComplete(userData, plan);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('app.error.plan'));
      setIsLoading(false); // Stop loading on error
    }
  }, [name, goal, challenge, language, onComplete, t]);

  /**
   * Handles form submission.
   * Prevents default browser action and triggers the onboarding logic.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeOnboarding();
  };


  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('onboarding.welcome')}</h2>
        <p className="mt-3 text-lg text-gray-600">{t('onboarding.intro')}</p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/50">
        <form onSubmit={handleSubmit} className="space-y-6">
           {error && <ErrorDisplay message={error} onRetry={executeOnboarding} title={t('app.error.plan')} />}
           <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">{t('onboarding.language.label')}</label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition bg-white"
              required
            >
              {(Object.keys(supportedLanguages) as LanguageCode[]).map(code => (
                <option key={code} value={code}>{supportedLanguages[code]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('onboarding.name.label')}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition"
              placeholder={t('onboarding.name.placeholder')}
              required
            />
          </div>
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">{t('onboarding.goal.label')}</label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition bg-white"
              required
            >
              <option value="" disabled>{t('onboarding.goal.placeholder')}</option>
              {goals.map(g => <option key={g.key} value={g.value}>{g.value}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 mb-1">{t('onboarding.challenge.label')}</label>
            <input
              type="text"
              id="challenge"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition"
              placeholder={t('onboarding.challenge.placeholder')}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading || !name || !goal || !challenge}
              className="w-full flex justify-center bg-brand-gold text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('onboarding.button.loading')}
                </>
              ) : t('onboarding.button.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;