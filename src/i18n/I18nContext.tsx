import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SupportedLanguage, resolveLocalized, resolveLocalizedArray, resolveLocalizedDict } from './types';
import { tr } from './tr';
import { en } from './en';

const STORAGE_KEY = 'petrosim_language';

interface I18nContextValue {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  toggleLang: () => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  resolveText: (value: any, fallback?: string) => string;
  resolveArray: (value: any) => string[];
  resolveDict: (value: any) => Record<string, string>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getNestedTranslation(obj: any, path: string): string | undefined {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'tr' || saved === 'en') {
        return saved;
      }
      return 'tr'; // Default is Turkish as specified
    } catch {
      return 'tr';
    }
  });

  const setLang = useCallback((newLang: SupportedLanguage) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'tr' ? 'en' : 'tr');
  }, [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const dictionary = useMemo(() => {
    return lang === 'tr' ? tr : en;
  }, [lang]);

  const fallbackDictionary = useMemo(() => {
    return lang === 'tr' ? en : tr;
  }, [lang]);

  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>): string => {
      let str = getNestedTranslation(dictionary, keyPath) || getNestedTranslation(fallbackDictionary, keyPath) || keyPath;
      if (params) {
        for (const [paramKey, paramValue] of Object.entries(params)) {
          str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
        }
      }
      return str;
    },
    [dictionary, fallbackDictionary]
  );

  const resolveText = useCallback(
    (value: any, fallback: string = ''): string => {
      return resolveLocalized(value, lang, fallback);
    },
    [lang]
  );

  const resolveArray = useCallback(
    (value: any): string[] => {
      return resolveLocalizedArray(value, lang);
    },
    [lang]
  );

  const resolveDict = useCallback(
    (value: any): Record<string, string> => {
      return resolveLocalizedDict(value, lang);
    },
    [lang]
  );

  const contextValue = useMemo<I18nContextValue>(() => ({
    lang,
    setLang,
    toggleLang,
    t,
    resolveText,
    resolveArray,
    resolveDict
  }), [lang, setLang, toggleLang, t, resolveText, resolveArray, resolveDict]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
