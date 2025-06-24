import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Clock,
  Eye,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Share2,
  TrendingUp,
} from "lucide-react";

const EducationalArticles = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<number>>(
    new Set(),
  );
  const [articleViews, setArticleViews] = useState<Record<number, number>>({});
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleReadArticle = (article: any) => {
    setSelectedArticle(article);
    setIsPreviewOpen(true);

    // Track view
    setArticleViews((prev) => ({
      ...prev,
      [article.id]: (prev[article.id] || 0) + 1,
    }));

    toast({
      title: "Opening Article Preview",
      description: `Loading "${article.title}"...`,
    });
  };

  const handleBookmark = (articleId: number, articleTitle: string) => {
    setBookmarkedArticles((prev) => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(articleId)) {
        newBookmarks.delete(articleId);
        toast({
          title: "Bookmark Removed",
          description: `"${articleTitle}" removed from bookmarks.`,
        });
      } else {
        newBookmarks.add(articleId);
        toast({
          title: "Article Bookmarked",
          description: `"${articleTitle}" saved to your bookmarks.`,
        });
      }
      return newBookmarks;
    });
  };

  const handleShare = (article: any) => {
    const shareText = `Check out this fraud awareness article: "${article.title}" - ${window.location.origin}/community`;

    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.excerpt,
          url: shareText,
        })
        .then(() => {
          toast({
            title: "Article Shared!",
            description: "Thank you for spreading fraud awareness.",
          });
        })
        .catch(() => {
          navigator.clipboard.writeText(shareText);
          toast({
            title: "Link Copied!",
            description: "Article link copied to clipboard.",
          });
        });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Link Copied!",
        description: "Article link copied to clipboard.",
      });
    }
  };
  const articles = [
    {
      id: 1,
      title: "How to Identify Phishing Emails: A Complete Guide",
      excerpt:
        "Learn the telltale signs of phishing attempts and protect yourself from email-based fraud schemes.",
      category: "Email Security",
      readTime: "5 min read",
      views: "12.3k",
      difficulty: "Beginner",
      publishDate: "2024-01-15",
      trending: true,
      content:
        "Phishing emails are one of the most common forms of cyber fraud. This comprehensive guide will teach you how to spot suspicious emails, verify sender authenticity, and protect your personal information. Key indicators include urgent language, suspicious links, grammar errors, and requests for sensitive information. Always verify sender identity through official channels before responding to any requests.",
      image:
        "https://images.pexels.com/photos/6963062/pexels-photo-6963062.jpeg",
    },
    {
      id: 2,
      title: "UPI Safety: Best Practices for Digital Payments",
      excerpt:
        "Essential tips for secure UPI transactions and avoiding payment-related fraud in India.",
      category: "Digital Payments",
      readTime: "7 min read",
      views: "8.7k",
      difficulty: "Intermediate",
      publishDate: "2024-01-12",
      trending: false,
      content:
        "UPI has revolutionized digital payments in India, but it also comes with security risks. Learn about transaction limits, merchant verification, secure PIN practices, and how to handle disputes. Never share your UPI PIN, always verify merchant details, and regularly monitor your transaction history for unauthorized payments.",
      image:
        "https://images.pexels.com/photos/7534804/pexels-photo-7534804.jpeg",
    },
    {
      id: 3,
      title: "Social Engineering Tactics: Psychology of Fraud",
      excerpt:
        "Understand how fraudsters manipulate human psychology to gain trust and steal information.",
      category: "Psychology",
      readTime: "10 min read",
      views: "15.2k",
      difficulty: "Advanced",
      publishDate: "2024-01-10",
      trending: true,
      content:
        "Social engineering exploits human psychology rather than technical vulnerabilities. Fraudsters use techniques like authority, urgency, fear, and reciprocity to manipulate victims. Understanding these psychological tactics helps you recognize and resist manipulation attempts. Trust your instincts and verify independently when something feels off.",
      image:
        "https://images.pexels.com/photos/19856564/pexels-photo-19856564.jpeg",
    },
    {
      id: 4,
      title: "Protecting Elderly from Financial Fraud",
      excerpt:
        "Special considerations and strategies to help senior citizens avoid becoming fraud victims.",
      category: "Senior Safety",
      readTime: "6 min read",
      views: "9.1k",
      difficulty: "Beginner",
      publishDate: "2024-01-08",
      trending: false,
      content:
        "Senior citizens are often targeted by fraudsters due to perceived vulnerability and accumulated wealth. Family involvement, clear communication channels, regular check-ins, and simplified security protocols can help protect elderly relatives. Educate them about common scams targeting seniors and establish trusted communication methods.",
      image:
        "https://images.pexels.com/photos/11955707/pexels-photo-11955707.jpeg",
    },
    {
      id: 5,
      title: "Cryptocurrency Fraud: Red Flags and Prevention",
      excerpt:
        "Navigate the complex world of cryptocurrency safely and avoid common investment scams.",
      category: "Investment Security",
      readTime: "8 min read",
      views: "6.2k",
      difficulty: "Advanced",
      publishDate: "2024-01-05",
      trending: true,
      content:
        "Cryptocurrency presents unique fraud risks including Ponzi schemes, fake exchanges, and investment scams. Learn to verify legitimate platforms, understand wallet security, recognize unrealistic return promises, and practice safe trading habits. Remember: if it sounds too good to be true, it probably is.",
      image:
        "https://images.pexels.com/photos/8370341/pexels-photo-8370341.jpeg",
    },
    {
      id: 6,
      title: "Romance Scam Awareness: Protecting Your Heart and Wallet",
      excerpt:
        "How to spot and avoid romance scams on dating platforms and social media.",
      category: "Social Media",
      readTime: "9 min read",
      views: "11.5k",
      difficulty: "Intermediate",
      publishDate: "2024-01-03",
      trending: false,
      content:
        "Romance scams exploit emotional vulnerability to steal money and personal information. Warning signs include rapid emotional escalation, refusal to meet in person, requests for money, and inconsistent stories. Take relationships slow, verify identity, and never send money to someone you haven't met in person.",
      image:
        "https://images.pexels.com/photos/20134134/pexels-photo-20134134.jpeg",
    },
  ];

  const categories = [
    "all",
    ...new Set(articles.map((article) => article.category)),
  ];
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchTerm === "" ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || article.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return (
          parseInt(b.views.replace(/[^\d]/g, "")) -
          parseInt(a.views.replace(/[^\d]/g, ""))
        );
      case "trending":
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      case "difficulty":
        const difficultyOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        return (
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        );
      case "latest":
      default:
        return (
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Advanced: "bg-red-100 text-red-800",
    };
    return colors[difficulty as keyof typeof colors] || colors.Beginner;
  };

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Fraud Awareness Articles
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Expert-curated educational content to help you stay one step ahead of
          fraudsters.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles, topics, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "All Levels" : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="difficulty">By Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">
            Showing {sortedArticles.length} articles
          </span>
          {searchTerm && (
            <Badge
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="cursor-pointer"
            >
              Search: "{searchTerm}" ×
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge
              variant="outline"
              onClick={() => setSelectedCategory("all")}
              className="cursor-pointer"
            >
              {selectedCategory} ×
            </Badge>
          )}
          {selectedDifficulty !== "all" && (
            <Badge
              variant="outline"
              onClick={() => setSelectedDifficulty("all")}
              className="cursor-pointer"
            >
              {selectedDifficulty} ×
            </Badge>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedArticles.map((article) => (
          <Card
            key={article.id}
            className="hover:shadow-lg transition-shadow group"
          >
            <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {article.trending && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => handleBookmark(article.id, article.title)}
              >
                {bookmarkedArticles.has(article.id) ? (
                  <BookmarkCheck className="h-4 w-4 text-india-saffron" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                <Badge className={getDifficultyColor(article.difficulty)}>
                  {article.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {article.readTime}
                </div>
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {article.views}
                  {articleViews[article.id] &&
                    ` (+${articleViews[article.id]})`}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleReadArticle(article)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read Article
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(article)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {sortedArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Article Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-india-saffron" />
              {selectedArticle?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            {selectedArticle && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Badge variant="outline">{selectedArticle.category}</Badge>
                  <Badge
                    className={getDifficultyColor(selectedArticle.difficulty)}
                  >
                    {selectedArticle.difficulty}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedArticle.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {selectedArticle.views}
                  </span>
                </div>

                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {selectedArticle.excerpt}
                  </p>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">
                      Article Content Preview
                    </h3>
                    <p className="text-gray-700">{selectedArticle.content}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleBookmark(selectedArticle.id, selectedArticle.title);
                    }}
                    variant={
                      bookmarkedArticles.has(selectedArticle.id)
                        ? "default"
                        : "outline"
                    }
                    className="flex-1"
                  >
                    {bookmarkedArticles.has(selectedArticle.id) ? (
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                    ) : (
                      <Bookmark className="h-4 w-4 mr-2" />
                    )}
                    {bookmarkedArticles.has(selectedArticle.id)
                      ? "Bookmarked"
                      : "Bookmark"}
                  </Button>
                  <Button
                    onClick={() => handleShare(selectedArticle)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Article
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EducationalArticles;
