import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LanguageCode, supportedLanguages } from '../types';
import translations from '../translations';

// Define the shape of the context value.
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

// Create the React Context.
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * The LanguageProvider component wraps the application and provides the language context
 * to all child components. It manages the current language state and the translation function.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components to be rendered within the provider.
 */
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  /**
   * The translation function (`t`). It takes a key and optional replacements,
   * finds the corresponding string in the translations file for the current language,
   * and replaces any placeholders (e.g., {name}).
   * @param key The key of the translation string (e.g., 'header.title').
   * @param replacements An object of placeholder values to inject into the string.
   * @returns The translated and formatted string.
   */
  const t = (key: string, replacements: Record<string, string | number> = {}): string => {
    // Find the translation string for the current language, or fall back to English if not found.
    let translation = translations[language][key] || translations['en'][key] || key;
    // Replace placeholders like {name} with their actual values.
    Object.keys(replacements).forEach(placeholder => {
      const regex = new RegExp(`{${placeholder}}`, 'g');
      translation = translation.replace(regex, String(replacements[placeholder]));
    });
    return translation;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * A custom hook to easily access the language context (language, setLanguage, t function)
 * from any component within the LanguageProvider.
 */
export const useTranslations = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  return context;
};