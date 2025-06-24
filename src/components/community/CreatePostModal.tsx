import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Heart,
  PlusCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  onCreatePost: (post: {
    title: string;
    content: string;
    category: string;
    author: string;
  }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onCreatePost }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    {
      value: "Warning",
      label: "Warning",
      icon: AlertTriangle,
      description: "Alert others about new scams",
    },
    {
      value: "Experience",
      label: "Experience",
      icon: MessageSquare,
      description: "Share your fraud encounter",
    },
    {
      value: "Alert",
      label: "Alert",
      icon: AlertTriangle,
      description: "Urgent community alerts",
    },
    {
      value: "Support",
      label: "Support",
      icon: Heart,
      description: "Help and emotional support",
    },
    {
      value: "Analysis",
      label: "Analysis",
      icon: BarChart3,
      description: "Data and trend analysis",
    },
    {
      value: "Question",
      label: "Question",
      icon: HelpCircle,
      description: "Ask the community",
    },
  ];

  const getCategoryColor = (categoryValue: string) => {
    const colors = {
      Warning: "bg-red-100 text-red-800 border-red-200",
      Experience: "bg-blue-100 text-blue-800 border-blue-200",
      Alert: "bg-orange-100 text-orange-800 border-orange-200",
      Support: "bg-purple-100 text-purple-800 border-purple-200",
      Analysis: "bg-green-100 text-green-800 border-green-200",
      Question: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[categoryValue as keyof typeof colors] || colors.Experience;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onCreatePost({
        title: title.trim(),
        content: content.trim(),
        category,
        author: "Community Member", // In real app, this would come from auth context
      });

      toast({
        title: "Post Created!",
        description: "Your discussion has been posted successfully.",
      });

      // Reset form
      setTitle("");
      setContent("");
      setCategory("");
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-india-saffron hover:bg-saffron-600">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Discussion Title *</Label>
            <Input
              id="title"
              placeholder="What would you like to discuss?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500">
              {title.length}/200 characters
            </p>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label>Category *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <div
                    key={cat.value}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all hover:shadow-sm ${
                      category === cat.value
                        ? getCategoryColor(cat.value)
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setCategory(cat.value)}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <span className="font-medium">{cat.label}</span>
                    </div>
                    <p className="text-xs mt-1 opacity-75">{cat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Message *</Label>
            <Textarea
              id="content"
              placeholder="Share your experience, ask a question, or provide information to help the community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={2000}
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500">
              {content.length}/2000 characters
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Community Guidelines
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be respectful and constructive</li>
              <li>• Share accurate information only</li>
              <li>• Protect personal and sensitive data</li>
              <li>• Help create a safe community space</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || !title.trim() || !content.trim() || !category
              }
              className="bg-india-saffron hover:bg-saffron-600"
            >
              {isSubmitting ? "Creating..." : "Create Discussion"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
