import React, { useState, useCallback } from 'react';
import { useTranslations } from '../contexts/LanguageContext';

interface SignUpProps {
  onSignUpSuccess: () => void;
  onNavigateToLogin: () => void;
}

/**
 * The SignUp component provides a form for new users to create an account.
 * @param {SignUpProps} props - The component props.
 */
const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onNavigateToLogin }) => {
  const { t } = useTranslations();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /**
   * Handles form submission, validates passwords, and calls the success callback.
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // In a real app, you'd show a more user-friendly error.
      alert("Passwords don't match!");
      return;
    }
    if (name && email && password) {
      // In a real app, you would have registration logic here.
      onSignUpSuccess();
    }
  }, [name, email, password, confirmPassword, onSignUpSuccess]);

  const handleNavigateToLogin = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onNavigateToLogin();
  }, [onNavigateToLogin]);

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('signup.welcome')}</h2>
        <p className="mt-3 text-lg text-gray-600">{t('signup.intro')}</p>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('signup.name.label')}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition"
              placeholder={t('signup.name.placeholder')}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 mb-1">{t('signup.email.label')}</label>
            <input
              type="email"
              id="email-signup"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition"
              placeholder={t('signup.email.placeholder')}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 mb-1">{t('signup.password.label')}</label>
            <input
              type="password"
              id="password-signup"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition"
              placeholder={t('signup.password.placeholder')}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">{t('signup.confirmPassword.label')}</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition"
              placeholder={t('signup.confirmPassword.placeholder')}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={!name || !email || !password || password !== confirmPassword}
              className="w-full flex justify-center bg-brand-gold text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {t('signup.button.create')}
            </button>
          </div>
        </form>
      </div>
       <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {t('signup.login.text')}{' '}
            <a href="#" onClick={handleNavigateToLogin} className="font-medium text-brand-gold hover:text-brand-gold-dark">
                {t('signup.login.link')}
            </a>
          </p>
        </div>
    </div>
  );
};

export default SignUp;