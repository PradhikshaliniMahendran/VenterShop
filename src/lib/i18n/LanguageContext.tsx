'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKeys } from './translations';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // 1. Check cookies for language preference
    const match = document.cookie.match(new RegExp('(^| )preferred_lang=([^;]+)'));
    if (match && (match[2] === 'en' || match[2] === 'ta')) {
      setLanguageState(match[2] as Language);
    } else {
      // 2. Check browser navigator language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ta') {
        setLanguageState('ta');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Persist language in cookies for 1 year
    document.cookie = `preferred_lang=${lang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
  };

  const t = (key: TranslationKeys): string => {
    const translationSet = translations[language] || translations.en;
    // Graceful fallback to English if key is missing in selected language
    return translationSet[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
