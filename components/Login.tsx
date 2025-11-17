import React, { useState, useCallback } from 'react';
import { useTranslations } from '../contexts/LanguageContext';

interface LoginProps {
  onLoginSuccess: () => void;
  onNavigateToSignUp: () => void;
}

/**
 * The Login component provides a mock login screen for the user to start the application.
 * In this mock version, any non-empty email/password will grant access.
 * @param {LoginProps} props - The component props.
 * @param {function} props.onLoginSuccess - Callback to notify the App component of a successful login.
 * @param {function} props.onNavigateToSignUp - Callback to navigate to the sign-up screen.
 */
const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateToSignUp }) => {
  const { t } = useTranslations();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  /**
   * Handles form submission.
   * It prevents the default form action and calls the onLoginSuccess callback.
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLoginSuccess();
    }
  }, [email, password, onLoginSuccess]);

  /**
   * Handles the mock "Forgot Password" flow.
   * Displays a confirmation message for a few seconds.
   */
  const handleForgotPassword = useCallback(() => {
    setResetEmailSent(true);
    setTimeout(() => {
        setResetEmailSent(false);
    }, 5000);
  }, []);
  
  const handleNavigateToSignUp = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      onNavigateToSignUp();
  }, [onNavigateToSignUp]);

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('login.welcome')}</h2>
        <p className="mt-3 text-lg text-gray-600">{t('login.intro')}</p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/50">
        {resetEmailSent ? (
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="font-semibold text-gray-700">{t('login.resetEmailSent')}</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('login.email.label')}</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition"
                  placeholder={t('login.email.placeholder')}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('login.password.label')}</label>
                    <button 
                        type="button" 
                        onClick={handleForgotPassword}
                        className="text-sm font-medium text-brand-gold hover:text-brand-gold-dark"
                    >
                        {t('login.forgotPassword')}
                    </button>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition"
                  placeholder={t('login.password.placeholder')}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!email || !password}
                  className="w-full flex justify-center bg-brand-gold text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {t('login.button.login')}
                </button>
              </div>
            </form>
        )}
      </div>
       <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {t('login.signup.text')}{' '}
            {/* FIX: Add onClick handler to navigate to sign up page */}
            <a href="#" onClick={handleNavigateToSignUp} className="font-medium text-brand-gold hover:text-brand-gold-dark">
                {t('login.signup.link')}
            </a>
          </p>
        </div>
    </div>
  );
};

export default Login;