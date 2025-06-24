import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Volume2, Headphones, Mic, CheckCircle } from "lucide-react";

const VoiceInputDemo: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoScenarios = [
    {
      id: "fraud-call",
      title: "Reporting a Fraud Call",
      description: "Example of how to report a suspicious phone call",
      english:
        "I received a call yesterday from someone claiming to be from my bank. They asked for my ATM PIN and OTP. I think it was a fraud call.",
      hindi:
        "कल मुझे किसी व्यक्ति का कॉल आया था जो अपने आप को मेरे बैंक का कहता था। उन्होंने मेरा ATM PIN और OTP मांगा था। मुझे लगता है यह धोखाधड़ी की कॉल थी।",
      category: "Phone Fraud",
      urgency: "High",
    },
    {
      id: "sms-fraud",
      title: "Reporting SMS Fraud",
      description: "Example of reporting a fraudulent text message",
      english:
        "I got an SMS saying I won a lottery of 5 lakh rupees. They are asking me to pay a processing fee first. This seems like a scam.",
      hindi:
        "मुझे एक SMS आया था जिसमें लिखा था कि मैंने 5 लाख रुपये की लॉटरी जीती है। वे पहले प्रोसेसिंग फीस मांग रहे हैं। यह घोटाला लगता है।",
      category: "SMS Fraud",
      urgency: "Medium",
    },
    {
      id: "investment-scam",
      title: "Investment Scam Report",
      description: "Example of reporting an investment fraud",
      english:
        "Someone contacted me through WhatsApp offering guaranteed returns on cryptocurrency investment. They are pressuring me to invest immediately.",
      hindi:
        "किसी व्यक्ति ने मुझसे WhatsApp के जरिए संपर्क किया और cryptocurrency investment पर guaranteed returns का offer किया। वे तुरंत invest करने का दबाव डाल रहे हैं।",
      category: "Investment Fraud",
      urgency: "High",
    },
  ];

  const speakDemo = (text: string, lang: "en" | "hi") => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.8;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <Card className="w-full mt-6 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Headphones className="h-5 w-5 mr-2 text-blue-600" />
          Voice Input Examples & Demos
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-white">
          Listen to sample voice inputs to understand how to effectively report
          fraud cases using voice.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demo Scenarios */}
        <div className="grid gap-4">
          {demoScenarios.map((scenario) => (
            <Card key={scenario.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      <Mic className="h-4 w-4 mr-2 text-blue-600" />
                      {scenario.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-light-yellow mt-1">
                      {scenario.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge
                      variant={
                        scenario.urgency === "High"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {scenario.urgency}
                    </Badge>
                    <Badge variant="outline">{scenario.category}</Badge>
                  </div>
                </div>

                {/* English Version */}
                <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-white">
                      English Version
                    </span>
                    <Button
                      onClick={() =>
                        isPlaying
                          ? stopSpeaking()
                          : speakDemo(scenario.english, "en")
                      }
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      {isPlaying && currentDemo === `${scenario.id}-en` ? (
                        <>
                          <Volume2 className="h-3 w-3 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-white italic">
                    "{scenario.english}"
                  </p>
                </div>

                {/* Hindi Version */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-white">
                      हिंदी Version
                    </span>
                    <Button
                      onClick={() =>
                        isPlaying
                          ? stopSpeaking()
                          : speakDemo(scenario.hindi, "hi")
                      }
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      {isPlaying && currentDemo === `${scenario.id}-hi` ? (
                        <>
                          <Volume2 className="h-3 w-3 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </>
                      )}
                    </Button>
                  </div>
                  <p
                    className="text-sm text-gray-700 dark:text-white italic"
                    dir="ltr"
                  >
                    "{scenario.hindi}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="bg-green-50 dark:bg-gray-800 border-green-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-green-800 dark:text-white mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Voice Input Best Practices
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-green-700 dark:text-light-yellow mb-2">
                  Speaking Tips:
                </h5>
                <ul className="space-y-1 text-green-600 dark:text-white">
                  <li>• Speak clearly and at normal pace</li>
                  <li>• Use your natural voice tone</li>
                  <li>• Avoid background noise</li>
                  <li>• Pause between sentences</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-green-700 dark:text-light-yellow mb-2">
                  Content Tips:
                </h5>
                <ul className="space-y-1 text-green-600 dark:text-white">
                  <li>• Include specific details (dates, numbers)</li>
                  <li>• Mention the type of fraud clearly</li>
                  <li>• Describe what happened step by step</li>
                  <li>• Include any evidence you have</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Browser Compatibility Notice */}
        <div className="text-xs text-gray-500 dark:text-light-yellow bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <strong>Browser Support:</strong> Voice input works best in Chrome,
          Edge, and Safari browsers. Make sure to allow microphone permissions
          when prompted. Your speech is processed locally for privacy.
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInputDemo;
