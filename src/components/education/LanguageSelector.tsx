
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' }
  ];

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Select Your Language</h3>
          <p className="text-gray-600">All educational content is available in multiple Indian languages</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={selectedLanguage === language.name ? 'default' : 'outline'}
              className="h-auto py-3 px-2 flex flex-col items-center space-y-1"
              onClick={() => setSelectedLanguage(language.name)}
            >
              <span className="text-sm font-medium">{language.name}</span>
              <span className="text-xs opacity-75">{language.native}</span>
            </Button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Selected: <span className="font-medium text-india-saffron">{selectedLanguage}</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Language preference will be applied to all educational content and downloads
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;
