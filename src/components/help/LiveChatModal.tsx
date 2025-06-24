import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Upload,
  Star,
  Users,
  Clock,
  Send,
  X,
  Minimize2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  content: string;
  timestamp: Date;
  attachments?: string[];
}

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [queuePosition, setQueuePosition] = useState(3);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [agentInfo] = useState({
    name: "Sarah Kumar",
    rating: 4.8,
    responseTime: "< 2 min",
  });
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConnected(true);
    setQueuePosition(0);

    toast({
      title: "Connecting to Support",
      description: "Finding an available agent...",
    });

    // Simulate agent connection
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: "1",
        sender: "agent",
        content:
          "Hello! I'm Sarah from the Chakshu support team. How can I help you with your fraud reporting or security concerns today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);

      toast({
        title: "Connected!",
        description: "You're now connected with a support agent.",
      });
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate agent response with context-aware replies
    setTimeout(() => {
      const responses = [
        "I understand your concern about this fraud incident. Let me help you with that. Could you provide me with your report ID or more details?",
        "That sounds like a serious issue. For fraud reports, I can guide you through the process. Do you have any evidence like screenshots or messages?",
        "Thank you for reaching out. I'm here to help with any questions about fraud prevention or reporting. What specific assistance do you need?",
        "I see you need help with this matter. Let me connect you with our fraud prevention specialist. Can you describe what happened?",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        content: randomResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentResponse]);
    }, 1500);
  };

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf,.doc,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: "user",
          content: `File uploaded: ${file.name}`,
          timestamp: new Date(),
          attachments: [file.name],
        };
        setMessages((prev) => [...prev, fileMessage]);

        toast({
          title: "File Uploaded",
          description: `${file.name} has been shared with the agent.`,
        });
      }
    };
    input.click();
  };

  const handleEndChat = () => {
    setIsConnected(false);
    setMessages([]);
    setQueuePosition(3);

    toast({
      title: "Chat Ended",
      description: "Thank you for contacting support. Have a safe day!",
    });

    onClose();
  };

  if (!isConnected) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-india-saffron" />
              Live Chat Support
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center py-6">
              <Users className="h-16 w-16 mx-auto mb-4 text-india-saffron" />
              <h3 className="font-semibold mb-2 text-lg">
                Connect with Our Support Team
              </h3>
              <p className="text-gray-600 mb-4">
                Get instant help with fraud reporting, security questions, and
                platform support
              </p>

              {queuePosition > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <Badge variant="secondary" className="mb-2">
                    Queue Position: {queuePosition}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Estimated wait time: {queuePosition * 2} minutes
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-600 p-2 bg-gray-50 rounded">
                  <Clock className="h-4 w-4" />
                  <span>Avg. response: 2 min</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 p-2 bg-gray-50 rounded">
                  <Star className="h-4 w-4" />
                  <span>Rating: 4.8/5</span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-left">
                <p className="text-sm font-medium text-gray-700">
                  Our agents can help with:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Fraud report submission and tracking</li>
                  <li>• Security advice and prevention tips</li>
                  <li>• Platform navigation and technical issues</li>
                  <li>• Connecting with law enforcement</li>
                </ul>
              </div>

              <Button
                onClick={handleConnect}
                className="w-full bg-india-saffron hover:bg-saffron-600"
                size="lg"
              >
                Start Live Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-2xl ${isMinimized ? "h-20" : "h-[600px]"} flex flex-col transition-all`}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-india-saffron" />
              Live Chat with {agentInfo.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex items-center gap-3 text-sm">
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {agentInfo.rating}
              </Badge>
              <span className="text-gray-500">
                Response time: {agentInfo.responseTime}
              </span>
              <span className="text-gray-500">Fraud Prevention Specialist</span>
            </div>
          )}
        </DialogHeader>

        {!isMinimized && (
          <>
            <ScrollArea className="flex-1 p-4 border rounded-lg">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${message.sender === "user" ? "order-first" : ""}`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-india-saffron text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.content}
                        {message.attachments && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((file, index) => (
                              <div
                                key={index}
                                className="text-xs opacity-75 flex items-center gap-1"
                              >
                                📎 {file}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 px-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-3 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message about fraud concerns..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleFileUpload}
                  variant="outline"
                  size="icon"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  className="bg-india-saffron hover:bg-saffron-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Supported: Images, PDFs, Screenshots, Documents</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEndChat}
                  className="text-red-600 hover:text-red-700"
                >
                  End Chat
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LiveChatModal;
