import React from 'react';
import { useTranslations } from '../contexts/LanguageContext';

interface HeaderProps {
    onRestart: () => void;
}

// A simple SVG icon component for the brand logo.
const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

/**
 * The main application header component.
 * Displays the application title and a button to restart the process.
 * @param {HeaderProps} props - The component props.
 * @param {() => void} props.onRestart - Callback function to reset the application state.
 */
const Header: React.FC<HeaderProps> = ({ onRestart }) => {
  const { t } = useTranslations();

  return (
    <header className="bg-off-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-brand-gold/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={onRestart} // The logo also acts as a restart button.
          >
            <LightbulbIcon />
            <h1 className="text-xl md:text-2xl font-bold text-brand-dark tracking-tight">
              {t('header.title')} <span className="font-light">{t('header.subtitle')}</span>
            </h1>
          </div>
          <button 
            onClick={onRestart} 
            className="hidden sm:block text-sm font-medium text-brand-dark hover:text-brand-gold-dark transition-colors"
          >
            {t('header.newPlan')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;