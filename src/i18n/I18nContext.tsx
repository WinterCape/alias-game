import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, Strings, getStrings } from './strings';

const LANG_KEY = '@alias_quest_language';

interface I18nContextType {
  lang: Language;
  t: Strings;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('ro');

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((saved) => {
      if (saved === 'en' || saved === 'ro') {
        setLang(saved);
      }
    });
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
    AsyncStorage.setItem(LANG_KEY, newLang).catch(() => {});
  }, []);

  const t = getStrings(lang);

  return (
    <I18nContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
