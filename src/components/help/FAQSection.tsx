
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, ThumbsUp, ThumbsDown, FileText } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

const FAQSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [votedQuestions, setVotedQuestions] = useState<Set<string>>(new Set());

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I report a fraud incident?',
      answer: 'To report fraud, click on "Report Fraud Now" on the main page. Fill out the form with incident details, upload evidence if available, and submit. You\'ll receive a report ID for tracking.',
      category: 'Reporting',
      helpful: 45,
      notHelpful: 2,
      tags: ['reporting', 'process', 'evidence']
    },
    {
      id: '2',
      question: 'What information do I need to provide?',
      answer: 'You need to provide: incident date and time, type of fraud, amount involved (if any), description of what happened, and any evidence like screenshots, emails, or transaction details.',
      category: 'Reporting',
      helpful: 38,
      notHelpful: 1,
      tags: ['requirements', 'evidence', 'details']
    },
    {
      id: '3',
      question: 'How can I track my report status?',
      answer: 'Go to the Dashboard section and look for your submitted reports. Each report shows its current status: Pending, Under Investigation, Resolved, or Closed.',
      category: 'Account',
      helpful: 52,
      notHelpful: 3,
      tags: ['tracking', 'status', 'dashboard']
    },
    {
      id: '4',
      question: 'Why is the website loading slowly?',
      answer: 'Slow loading can be due to high traffic, poor internet connection, or browser issues. Try refreshing the page, clearing your browser cache, or using a different browser.',
      category: 'Technical',
      helpful: 23,
      notHelpful: 8,
      tags: ['performance', 'browser', 'troubleshooting']
    },
    {
      id: '5',
      question: 'Can I update my report after submission?',
      answer: 'Yes, you can add additional information to your report through the Dashboard. Look for the "Add Update" button next to your report.',
      category: 'Reporting',
      helpful: 31,
      notHelpful: 2,
      tags: ['update', 'modification', 'additional-info']
    },
    {
      id: '6',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.',
      category: 'Account',
      helpful: 67,
      notHelpful: 1,
      tags: ['password', 'reset', 'login']
    }
  ];

  const categories = ['all', 'Reporting', 'Account', 'Technical'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVote = (faqId: string, isHelpful: boolean) => {
    if (votedQuestions.has(faqId)) return;
    setVotedQuestions(prev => new Set([...prev, faqId]));
    // In a real app, this would update the backend
    console.log(`Voted ${isHelpful ? 'helpful' : 'not helpful'} for FAQ ${faqId}`);
  };

  const getRelatedQuestions = (currentFaq: FAQ) => {
    return faqs
      .filter(faq => faq.id !== currentFaq.id && faq.category === currentFaq.category)
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'All' : category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredFAQs.length} of {faqs.length} questions
            </div>

            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <span>{faq.question}</span>
                      <Badge variant="secondary" className="text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-gray-700">{faq.answer}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">Was this helpful?</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVote(faq.id, true)}
                              disabled={votedQuestions.has(faq.id)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              {faq.helpful}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVote(faq.id, false)}
                              disabled={votedQuestions.has(faq.id)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsDown className="h-3 w-3" />
                              {faq.notHelpful}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {getRelatedQuestions(faq).length > 0 && (
                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Related Questions:</h4>
                          <div className="space-y-1">
                            {getRelatedQuestions(faq).map(related => (
                              <Button
                                key={related.id}
                                variant="ghost"
                                size="sm"
                                className="justify-start h-auto p-2 text-left text-sm text-blue-600 hover:text-blue-800"
                              >
                                {related.question}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No FAQs found matching your search criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQSection;
