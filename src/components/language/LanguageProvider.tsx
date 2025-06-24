
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  currentRegion: string;
  setLanguage: (language: string) => void;
  setRegion: (region: string) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentRegion, setCurrentRegion] = useState('Maharashtra');

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  const setRegion = (region: string) => {
    setCurrentRegion(region);
  };

  const isRTL = currentLanguage === 'ur';

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        currentRegion, 
        setLanguage, 
        setRegion, 
        isRTL 
      }}
    >
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
