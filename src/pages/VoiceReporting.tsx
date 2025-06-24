import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import VoiceInput from "@/components/language/VoiceInput";
import VoiceInputDemo from "@/components/language/VoiceInputDemo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Volume2,
  Mic,
  FileText,
  Send,
  ArrowLeft,
  Info,
  CheckCircle,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const VoiceReporting = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [transcription, setTranscription] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" },
    { code: "mr", name: "Marathi", native: "मराठी" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { code: "ur", name: "Urdu", native: "اردو" },
  ];

  const fraudCategories = [
    "Phone Call Fraud",
    "SMS/Text Message Fraud",
    "Email Phishing",
    "Investment Scam",
    "Lottery/Prize Scam",
    "Banking Fraud",
    "Online Shopping Fraud",
    "Social Media Fraud",
    "Cryptocurrency Scam",
    "Tech Support Scam",
    "Romance Scam",
    "Other",
  ];

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
    toast({
      title: "Voice Input Captured",
      description:
        "Your voice has been converted to text. You can review and edit it below.",
    });
  };

  const handleSubmitReport = async () => {
    if (!transcription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please record your voice input or add text manually.",
        variant: "destructive",
      });
      return;
    }

    if (!reportCategory) {
      toast({
        title: "Missing Category",
        description: "Please select a fraud category for your report.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate report submission
    setTimeout(() => {
      const reportId = `VR${Date.now().toString().slice(-8)}`;

      toast({
        title: "Report Submitted Successfully",
        description: `Your voice report has been submitted with ID: ${reportId}`,
      });

      // Navigate to dashboard or reports page
      navigate("/dashboard", {
        state: {
          newReport: {
            id: reportId,
            type: "voice",
            category: reportCategory,
            content: transcription.substring(0, 100) + "...",
          },
        },
      });

      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="mb-6 border-white text-white hover:bg-white hover:text-green-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <div className="flex items-center justify-center mb-4">
              <Volume2 className="h-12 w-12 mr-4" />
              <Mic className="h-8 w-8" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Voice Fraud Reporting
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Report fraud using your voice. Speak naturally in your preferred
              language, and our AI will convert your speech to text for official
              submission.
            </p>

            <div className="flex justify-center space-x-4 mt-6">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Mic className="h-3 w-3 mr-1" />
                Voice Recognition
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Volume2 className="h-3 w-3 mr-1" />
                Audio Playback
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <FileText className="h-3 w-3 mr-1" />
                Auto Transcription
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <NavigationButtons />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="h-5 w-5 mr-2 text-blue-600" />
              Language Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Select Your Preferred Language</Label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.native} ({lang.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Fraud Category</Label>
                <Select
                  value={reportCategory}
                  onValueChange={setReportCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select fraud type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fraudCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Input Section */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Mic className="h-6 w-6 text-green-600 mr-2" />
                Voice Input & Recording
              </div>
              <Badge variant="outline" className="bg-white">
                AI Powered
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-white">
              Click the microphone button below and describe the fraud incident
              in detail. Include dates, phone numbers, amounts, and any other
              relevant information.
            </p>
          </CardHeader>
          <CardContent>
            <VoiceInput
              language={selectedLanguage}
              onTranscriptionComplete={handleTranscriptionComplete}
            />
          </CardContent>
        </Card>

        {/* Transcription Review */}
        {transcription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Review & Edit Your Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Review the transcribed text below. You can edit it to add more
                  details or correct any errors.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="transcription">Your Report Content</Label>
                <Textarea
                  id="transcription"
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Your voice input will appear here..."
                  rows={8}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-light-yellow mt-1">
                  <span>{transcription.length} characters</span>
                  <span>
                    {
                      transcription.split(" ").filter((word) => word.length > 0)
                        .length
                    }{" "}
                    words
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Add any additional information, evidence details, or clarifications..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Section */}
        <VoiceInputDemo />

        {/* Submit Section */}
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ready to Submit Your Voice Report?
              </h3>
              <p className="text-gray-600 dark:text-white max-w-2xl mx-auto">
                Once submitted, your report will be processed by our AI system
                and forwarded to the appropriate authorities. You'll receive a
                confirmation with a tracking ID.
              </p>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  size="lg"
                >
                  Save as Draft
                </Button>

                <Button
                  onClick={handleSubmitReport}
                  disabled={
                    isSubmitting || !transcription.trim() || !reportCategory
                  }
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Voice Report
                    </>
                  )}
                </Button>
              </div>

              {(!transcription.trim() || !reportCategory) && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Please complete the voice input and select a fraud category
                  before submitting.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-blue-50 dark:bg-gray-800 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <Info className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-white mb-2">
                Need Help with Voice Reporting?
              </h3>
              <p className="text-blue-700 dark:text-white mb-4">
                Our support team is available 24/7 to assist you with voice
                reporting features.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  View Tutorial
                </Button>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm">
                  Report Issue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default VoiceReporting;
