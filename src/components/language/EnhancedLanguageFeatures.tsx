import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSelector from "./LanguageSelector";
import VoiceInput from "./VoiceInput";
import VoiceInputDemo from "./VoiceInputDemo";
import RegionalContent from "./RegionalContent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Volume2 } from "lucide-react";

const EnhancedLanguageFeatures = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedState, setSelectedState] = useState("Maharashtra");

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const handleTranscription = (text: string) => {
    console.log("Voice transcription received:", text);
  };

  return (
    <div className="space-y-8">
      {/* Language and Region Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-6 w-6 text-blue-600 mr-2" />
            Multi-Language & Regional Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Language / भाषा चुनें
              </label>
              <LanguageSelector />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select State / राज्य चुनें
              </label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Choose your state" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto bg-white border shadow-lg z-50">
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {state}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center">
              <Volume2 className="h-3 w-3 mr-1" />
              Voice Support
            </Badge>
            <Badge variant="outline">12+ Languages</Badge>
            <Badge variant="outline">Regional Scripts</Badge>
            <Badge variant="outline">Cultural Context</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Voice Input Section */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Volume2 className="h-6 w-6 text-green-600 mr-2" />
              Voice Input & Audio Playback
            </div>
            <Badge variant="outline" className="bg-white">
              AI Powered
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-white mt-2">
            Advanced speech recognition with multi-language support. Perfect for
            users who prefer speaking over typing, including support for
            regional dialects and accessibility features.
          </p>
        </CardHeader>
        <CardContent>
          <VoiceInput
            language={selectedLanguage}
            onTranscriptionComplete={handleTranscription}
          />

          {/* Additional Features */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Volume2 className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Speech-to-Text
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-light-yellow">
                Real-time voice transcription with high accuracy for Indian
                languages
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Volume2 className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Text-to-Speech
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-light-yellow">
                Natural-sounding voice playback for content accessibility
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Volume2 className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Audio Recording
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-light-yellow">
                Save and replay your voice recordings for evidence purposes
              </p>
            </div>
          </div>

          {/* Voice Input Demo */}
          <VoiceInputDemo />
        </CardContent>
      </Card>

      {/* Regional Content */}
      <RegionalContent language={selectedLanguage} state={selectedState} />
    </div>
  );
};

export default EnhancedLanguageFeatures;
