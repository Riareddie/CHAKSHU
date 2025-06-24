import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquare,
  Phone,
  Headphones,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLiveChat } from "@/contexts/LiveChatContext";

const FAQSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { toast } = useToast();
  const { openLiveChat } = useLiveChat();

  const handleContactSupport = () => {
    toast({
      title: "Contact Support",
      description:
        "Opening support ticket form. You'll be redirected to our support portal.",
    });

    // In a real app, this would open a support form or redirect to a support portal
    window.open(
      "mailto:support@chakshu.gov.in?subject=Support Request&body=Please describe your issue...",
      "_blank",
    );
  };

  const handleLiveChat = () => {
    openLiveChat();
    toast({
      title: "Live Chat Opening",
      description: "Opening live chat support...",
    });
  };

  const handleCall1930 = () => {
    toast({
      title: "Calling 1930",
      description: "Initiating call to National Cyber Crime Helpline...",
    });

    // For mobile devices, this will actually initiate the call
    window.open("tel:1930", "_self");
  };

  const faqs = [
    {
      category: "Reporting Process",
      question: "How do I report a fraud incident?",
      answer:
        "You can report fraud through our online portal by clicking 'Report Fraud' on the homepage. Fill in the required details, upload evidence if available, and submit. You'll receive a reference number to track your complaint.",
    },
    {
      category: "Reporting Process",
      question: "What information do I need to report fraud?",
      answer:
        "Basic details include: type of fraud, date and time of incident, financial loss (if any), communication details (phone numbers, emails, websites), and any evidence like screenshots, recordings, or documents.",
    },
    {
      category: "Account Security",
      question: "How can I secure my bank account after fraud?",
      answer:
        "Immediately contact your bank to freeze the account, change all passwords and PINs, monitor account statements regularly, set up transaction alerts, and file a complaint with both your bank and our portal.",
    },
    {
      category: "Digital Payments",
      question: "What should I do if I've made a fraudulent UPI transaction?",
      answer:
        "Contact your bank immediately, report to the UPI app customer service, file a complaint on our portal, keep all transaction details and screenshots, and report to the National Cyber Crime Reporting Portal (cybercrime.gov.in).",
    },
    {
      category: "Prevention",
      question: "How can I verify if a website is legitimate?",
      answer:
        "Check for HTTPS in the URL, look for contact information and physical address, verify SSL certificates, read reviews and ratings, check domain registration details, and be wary of poor grammar or spelling.",
    },
    {
      category: "Recovery",
      question: "Can I recover money lost to fraud?",
      answer:
        "Recovery depends on various factors including how quickly you report, the fraud type, and cooperation from financial institutions. Report immediately to increase chances of recovery through our portal and your bank.",
    },
    {
      category: "Legal Process",
      question: "What legal action can be taken against fraudsters?",
      answer:
        "Fraud cases can be filed under IT Act 2000, IPC sections for cheating and forgery, and specific banking laws. Our portal helps connect you with law enforcement for proper legal proceedings.",
    },
    {
      category: "Technical Support",
      question: "I'm having trouble accessing my account. What should I do?",
      answer:
        "Try clearing your browser cache and cookies, disable ad blockers, use a different browser, or contact our technical support team. For persistent issues, use the 'Live Chat' option for immediate assistance.",
    },
    {
      category: "Mobile App",
      question: "Is there a mobile app for reporting fraud?",
      answer:
        "Yes, our mobile app is available on both Android and iOS. You can download it from the Play Store or App Store. The app offers all the features of the web portal with the convenience of mobile reporting.",
    },
    {
      category: "Privacy & Security",
      question: "How is my personal information protected?",
      answer:
        "We use end-to-end encryption, secure servers, and follow government data protection guidelines. Your information is only shared with authorized law enforcement agencies when necessary for investigation purposes.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about fraud reporting, prevention,
          and our services.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchTerm("")}
          className={searchTerm === "" ? "bg-india-saffron text-white" : ""}
        >
          All ({faqs.length})
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            onClick={() => setSearchTerm(category.toLowerCase())}
            className={
              searchTerm.toLowerCase() === category.toLowerCase()
                ? "bg-india-saffron text-white"
                : ""
            }
          >
            {category} ({faqs.filter((faq) => faq.category === category).length}
            )
          </Button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          Showing {filteredFAQs.length} of {faqs.length} questions
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              No FAQs found matching your search.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader
                className="cursor-pointer"
                onClick={() =>
                  setExpandedFAQ(expandedFAQ === index ? null : index)
                }
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                    </div>
                    <CardTitle className="text-left text-lg">
                      {faq.question}
                    </CardTitle>
                  </div>
                  {expandedFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
              {expandedFAQ === index && (
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Support Section */}
      <Card className="mt-12">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help
            you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleContactSupport}
              className="bg-india-saffron hover:bg-saffron-600"
            >
              <Headphones className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" onClick={handleLiveChat}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Live Chat
            </Button>
            <Button
              variant="outline"
              onClick={handleCall1930}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 1930
            </Button>
          </div>
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">
              <Phone className="w-4 h-4 inline mr-1" />
              <strong>Emergency:</strong> For urgent fraud cases, call 1930
              (National Cyber Crime Helpline) immediately
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FAQSection;
