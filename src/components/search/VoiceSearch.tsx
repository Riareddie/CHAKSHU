
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceSearchProps {
  onResult: (transcript: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize Speech Recognition
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-IN'; // English (India)

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Voice search failed. Please try again.';
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable microphone permissions.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
      }
      
      toast({
        title: "Voice Search Error",
        description: errorMessage,
        variant: "destructive"
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult, toast]);

  const startListening = () => {
    if (!isSupported) {
      toast({
        title: "Voice Search Not Supported",
        description: "Your browser doesn't support voice search. Please try typing instead.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsListening(true);
      recognitionRef.current?.start();
      
      toast({
        title: "Listening...",
        description: "Speak now to search. Say something like 'show me phishing emails' or 'UPI fraud reports'",
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      toast({
        title: "Voice Search Failed",
        description: "Could not start voice search. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  if (!isSupported) {
    return null; // Don't render the button if not supported
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={isListening ? stopListening : startListening}
      disabled={!isSupported}
      className={`${isListening ? 'bg-red-50 border-red-300 text-red-600' : ''}`}
      title={isListening ? 'Stop listening' : 'Start voice search'}
    >
      {isListening ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceSearch;
