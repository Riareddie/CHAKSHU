
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Upload, Star, Users, Clock } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
  attachments?: string[];
}

const LiveChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [queuePosition, setQueuePosition] = useState(3);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [agentInfo, setAgentInfo] = useState({
    name: 'Sarah Kumar',
    rating: 4.8,
    responseTime: '< 2 min'
  });

  const handleConnect = () => {
    setIsConnected(true);
    setQueuePosition(0);
    
    // Simulate agent connection
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: '1',
        sender: 'agent',
        content: 'Hello! I\'m Sarah from the support team. How can I help you today?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: 'I understand your concern. Let me help you with that. Could you provide me with your report ID?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1500);
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const fileMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: 'File uploaded: screenshot.png',
      timestamp: new Date(),
      attachments: ['screenshot.png']
    };
    setMessages(prev => [...prev, fileMessage]);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Live Chat Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Connect with Support</h3>
            <p className="text-gray-600 mb-4">
              Get instant help from our support team
            </p>
            
            {queuePosition > 0 && (
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  Queue Position: {queuePosition}
                </Badge>
                <p className="text-sm text-gray-500">
                  Estimated wait time: {queuePosition * 2} minutes
                </p>
              </div>
            )}
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Average response time: 2 minutes
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4" />
                Customer satisfaction: 4.8/5
              </div>
            </div>
            
            <Button onClick={handleConnect} className="w-full">
              Start Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Live Chat
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Online</span>
          </div>
        </CardTitle>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium">{agentInfo.name}</span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {agentInfo.rating}
          </Badge>
          <span className="text-gray-500">
            Avg. response: {agentInfo.responseTime}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                    {message.attachments && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((file, index) => (
                          <div key={index} className="text-xs opacity-75">
                            📎 {file}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4 space-y-2">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleFileUpload} variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
            <Button onClick={handleSendMessage}>
              Send
            </Button>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Files supported: Images, PDFs, Documents</span>
            <Button variant="ghost" size="sm" onClick={() => setIsConnected(false)}>
              End Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveChat;
