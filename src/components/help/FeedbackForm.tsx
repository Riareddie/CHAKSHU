
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, CheckCircle } from "lucide-react";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState({
    category: '',
    subject: '',
    message: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedback.subject || !feedback.message || rating === 0) return;
    
    console.log('Feedback submitted:', { ...feedback, rating });
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setFeedback({ category: '', subject: '', message: '', email: '' });
    }, 3000);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Your feedback has been submitted successfully. We appreciate your input!
          </p>
          <p className="text-sm text-gray-500">
            Our team will review your feedback and respond if necessary.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Feedback & Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-3 block">
            How would you rate your overall experience?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-colors"
              >
                <Star 
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && "We're sorry to hear that. Please tell us how we can improve."}
              {rating === 2 && "We appreciate your feedback. What can we do better?"}
              {rating === 3 && "Thanks for your rating. How can we make this better?"}
              {rating === 4 && "Great! We'd love to hear what you liked and what we can improve."}
              {rating === 5 && "Excellent! We're thrilled you had a great experience."}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Category</label>
          <select 
            value={feedback.category}
            onChange={(e) => setFeedback(prev => ({ ...prev, category: e.target.value }))}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Select a category</option>
            <option value="user-interface">User Interface</option>
            <option value="functionality">Functionality</option>
            <option value="performance">Performance</option>
            <option value="content">Content</option>
            <option value="suggestion">Feature Suggestion</option>
            <option value="bug-report">Bug Report</option>
            <option value="general">General Feedback</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Subject</label>
          <Input
            value={feedback.subject}
            onChange={(e) => setFeedback(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Brief summary of your feedback"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Your Feedback</label>
          <Textarea
            value={feedback.message}
            onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
            rows={5}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email (Optional)</label>
          <Input
            type="email"
            value={feedback.email}
            onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your.email@example.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide your email if you'd like us to follow up on your feedback
          </p>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!feedback.subject || !feedback.message || rating === 0}
          >
            Submit Feedback
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Your feedback helps us improve our platform for everyone
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
