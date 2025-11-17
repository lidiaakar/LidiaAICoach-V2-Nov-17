import React from 'react';
import { useTranslations } from '../contexts/LanguageContext';

/**
 * The main application footer component.
 * Displays copyright information with the current year.
 */
const Footer: React.FC = () => {
  const { t } = useTranslations();
  return (
    <footer className="bg-off-white border-t border-brand-gold/10 mt-12">
      <div className="container mx-auto px-4 py-4">
        <p className="text-center text-xs text-gray-500">
          {/* The t function replaces {year} with the current year. */}
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;