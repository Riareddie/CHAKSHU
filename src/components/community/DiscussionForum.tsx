// Legacy DiscussionForum - redirects to Enhanced version for better responsive design and CRUD integration
import React from "react";
import EnhancedDiscussionForum from "./EnhancedDiscussionForum";

const initialForumPosts = [
  {
    id: 1,
    title:
      "New UPI scam targeting senior citizens - Please share with elderly family",
    author: "CommunityGuardian",
    category: "Warning",
    replies: 23,
    likes: 45,
    hasLiked: false,
    timeAgo: "2 hours ago",
    isPinned: true,
    preview:
      "I want to alert everyone about a new UPI scam where fraudsters are calling elderly people claiming to be from their bank...",
    content:
      "I want to alert everyone about a new UPI scam where fraudsters are calling elderly people claiming to be from their bank. They're asking for UPI PINs and OTPs over the phone. My grandmother almost fell for this yesterday. The caller knew her name and bank details, making it seem legitimate. Please warn your elderly family members - banks NEVER ask for PINs or OTPs over phone calls. If anyone receives such calls, immediately hang up and report to your bank's official customer service number.",
  },
  {
    id: 2,
    title:
      "How I avoided a cryptocurrency investment scam - Red flags to watch",
    author: "TechSavvy2024",
    category: "Experience",
    replies: 18,
    likes: 32,
    hasLiked: false,
    timeAgo: "5 hours ago",
    isPinned: false,
    preview:
      "Last week someone approached me with a 'guaranteed' crypto investment opportunity. Here's how I spotted the red flags...",
    content:
      "Last week someone approached me with a 'guaranteed' crypto investment opportunity promising 300% returns in 30 days. Here are the red flags I noticed: 1) Pressure to invest immediately, 2) No proper documentation or registration, 3) Asking for payments via UPI only, 4) Testimonials looked fake with stock photos, 5) No proper website or physical address. When I asked for their SEBI registration, they became aggressive. Always verify investment opportunities through official channels!",
  },
  {
    id: 3,
    title: "Fake job portal asking for registration fees - Company name list",
    author: "JobSeeker",
    category: "Alert",
    replies: 67,
    likes: 89,
    hasLiked: false,
    timeAgo: "1 day ago",
    isPinned: false,
    preview:
      "I've compiled a list of fake job portals that are asking for registration fees. Please be careful...",
    content:
      "I've compiled a list of fake job portals that are asking for registration fees: 1) JobsIndia24.com, 2) QuickHireIndia.in, 3) InstantJobs.co.in. These sites promise government jobs and ask for registration fees ranging from ₹500-₹5000. Legitimate job portals NEVER ask for money upfront. I reported these to cybercrime portal. Please share this information to prevent others from getting scammed.",
  },
  {
    id: 4,
    title: "Romance scam recovery support group",
    author: "SupportHelper",
    category: "Support",
    replies: 42,
    likes: 156,
    hasLiked: false,
    timeAgo: "2 days ago",
    isPinned: false,
    preview:
      "For those who have been victims of romance scams, this is a safe space to share experiences and get support...",
    content:
      "For those who have been victims of romance scams, this is a safe space to share experiences and get support. Romance scams are emotionally devastating and financially damaging. You are not alone, and it's not your fault. This community is here to help you heal and move forward. Please feel free to share your story, ask questions, or just read others' experiences. Together we can support each other and prevent others from falling victim to these heartless criminals.",
  },
  {
    id: 5,
    title: "Regional fraud trends - Mumbai area analysis",
    author: "DataAnalyst",
    category: "Analysis",
    replies: 15,
    likes: 28,
    hasLiked: false,
    timeAgo: "3 days ago",
    isPinned: false,
    preview:
      "Based on the last month's data, here are the most common fraud types in Mumbai and surrounding areas...",
    content:
      "Based on the last month's data from community reports, here are the most common fraud types in Mumbai and surrounding areas: 1) UPI/Digital payment frauds (35%), 2) Fake job offers (22%), 3) Investment scams (18%), 4) Online shopping frauds (15%), 5) Romance scams (10%). Peak activity times are 10 AM-12 PM and 7 PM-9 PM on weekdays. Stay vigilant during these times and always verify before making any payments or sharing personal information.",
  },
];

const DiscussionForum = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [forumPosts, setForumPosts] = useState(() => initialForumPosts);
  const [selectedPost, setSelectedPost] = useState<
    (typeof initialForumPosts)[0] | null
  >(null);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState(5); // Show 5 posts initially
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { toast } = useToast();

  const requireAuth = (action: string, callback: () => void) => {
    if (!user) {
      toast({
        title: "Sign in Required",
        description: `Please sign in to ${action}. Join the community to participate in discussions!`,
        variant: "default",
      });
      setAuthMode("login");
      setIsAuthModalOpen(true);
      return;
    }
    callback();
  };

  const handleLike = (postId: number) => {
    requireAuth("like posts", () => {
      setForumPosts((posts) =>
        posts.map((post) => {
          if (post.id === postId) {
            const newLikes = post.hasLiked ? post.likes - 1 : post.likes + 1;
            return {
              ...post,
              likes: newLikes,
              hasLiked: !post.hasLiked,
            };
          }
          return post;
        }),
      );

      // Also update selected post if it's the same
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost((prev) =>
          prev
            ? {
                ...prev,
                likes: prev.hasLiked ? prev.likes - 1 : prev.likes + 1,
                hasLiked: !prev.hasLiked,
              }
            : null,
        );
      }

      toast({
        title: "Vote recorded",
        description: "Thank you for participating in the community discussion!",
      });
    });
  };

  const handleReply = (postId: number, postTitle: string) => {
    requireAuth("reply to posts", () => {
      const post = forumPosts.find((p) => p.id === postId);
      if (post) {
        setSelectedPost(post);
        setIsPostDetailOpen(true);
      }
    });
  };

  const handleCreatePost = (newPostData: {
    title: string;
    content: string;
    category: string;
    author: string;
  }) => {
    const newPost = {
      id: Math.max(...forumPosts.map((p) => p.id)) + 1,
      ...newPostData,
      replies: 0,
      likes: 0,
      hasLiked: false,
      timeAgo: "just now",
      isPinned: false,
      preview:
        newPostData.content.slice(0, 150) +
        (newPostData.content.length > 150 ? "..." : ""),
    };

    setForumPosts((posts) => [newPost, ...posts]);

    toast({
      title: "Discussion Created!",
      description: "Your post has been published successfully.",
    });
  };

  const handlePostClick = (post: (typeof initialForumPosts)[0]) => {
    setSelectedPost(post);
    setIsPostDetailOpen(true);
  };

  const handleAddComment = async (postId: number, comment: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update replies count
    setForumPosts((posts) =>
      posts.map((post) =>
        post.id === postId ? { ...post, replies: post.replies + 1 } : post,
      ),
    );

    // Update selected post
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) =>
        prev ? { ...prev, replies: prev.replies + 1 } : null,
      );
    }
  };

  const handleLikeComment = async (postId: number, commentId: number) => {
    requireAuth("like comments", () => {
      // In a real app, this would update the comment's like status
      toast({
        title: "Comment liked",
        description: "Your reaction has been recorded.",
      });
    });
  };

  const handleReplyToComment = async (
    postId: number,
    commentId: number,
    reply: string,
  ) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: "Reply added",
      description: "Your reply has been posted successfully.",
    });
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show 5 more posts
    setDisplayedPosts((prev) => Math.min(prev + 5, forumPosts.length));
    setIsLoadingMore(false);

    toast({
      title: "More discussions loaded",
      description: `Showing ${Math.min(displayedPosts + 5, forumPosts.length)} of ${forumPosts.length} discussions`,
    });
  };

  const categories = [
    {
      name: "All",
      count: forumPosts.length,
      color: "bg-gray-100 text-gray-800",
    },
    {
      name: "Warning",
      count: forumPosts.filter((p) => p.category === "Warning").length,
      color: "bg-red-100 text-red-800",
    },
    {
      name: "Experience",
      count: forumPosts.filter((p) => p.category === "Experience").length,
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Alert",
      count: forumPosts.filter((p) => p.category === "Alert").length,
      color: "bg-orange-100 text-orange-800",
    },
    {
      name: "Support",
      count: forumPosts.filter((p) => p.category === "Support").length,
      color: "bg-purple-100 text-purple-800",
    },
    {
      name: "Analysis",
      count: forumPosts.filter((p) => p.category === "Analysis").length,
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Question",
      count: forumPosts.filter((p) => p.category === "Question").length,
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Warning: "bg-red-100 text-red-800",
      Experience: "bg-blue-100 text-blue-800",
      Alert: "bg-orange-100 text-orange-800",
      Support: "bg-purple-100 text-purple-800",
      Analysis: "bg-green-100 text-green-800",
      Question: "bg-yellow-100 text-yellow-800",
    };
    return colors[category as keyof typeof colors] || colors.Experience;
  };

  const filteredPosts = forumPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Community Forum
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Share experiences, ask questions, and help others stay safe from
          fraud.
        </p>
        <div className="flex justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{forumPosts.length} discussions</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>
              {forumPosts.reduce((sum, post) => sum + post.replies, 0)} comments
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span>
              {forumPosts.reduce((sum, post) => sum + post.likes, 0)} likes
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex space-x-4">
              {user ? (
                <CreatePostModal onCreatePost={handleCreatePost} />
              ) : (
                <Button
                  onClick={() => {
                    setAuthMode("signup");
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-india-saffron hover:bg-saffron-600 text-white"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Sign in to Create Post
                </Button>
              )}
              <Dialog
                open={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">Browse Categories</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Browse Discussion Categories</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Select a category to filter discussions or search across
                      all posts.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <Card
                          key={category.name}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedCategory === category.name
                              ? "ring-2 ring-india-saffron border-india-saffron"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedCategory(category.name);
                            setIsCategoryDialogOpen(false);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">
                                  {category.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {category.count} discussions
                                </p>
                              </div>
                              <Badge className={category.color}>
                                {category.count}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Showing:</span>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-gray-200"
              onClick={() => setSelectedCategory("All")}
            >
              {selectedCategory}
              {selectedCategory !== "All" && " ×"}
            </Badge>
            {searchTerm && (
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSearchTerm("")}
              >
                "{searchTerm}" ×
              </Badge>
            )}
            <span className="text-sm text-gray-500">
              ({filteredPosts.length} discussion
              {filteredPosts.length !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  No discussions found
                </h3>
                <p className="text-sm">
                  {searchTerm
                    ? `No discussions match "${searchTerm}"`
                    : `No discussions in ${selectedCategory} category`}
                </p>
                <div className="mt-4 space-x-2">
                  {searchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear search
                    </Button>
                  )}
                  {selectedCategory !== "All" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCategory("All")}
                    >
                      View all categories
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            filteredPosts.slice(0, displayedPosts).map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <div className="w-full h-full bg-gradient-to-br from-india-saffron to-saffron-600 flex items-center justify-center text-white font-semibold">
                        {post.author.charAt(0)}
                      </div>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-2">
                        {post.isPinned && (
                          <Pin className="h-4 w-4 text-india-saffron" />
                        )}
                        <Badge className={getCategoryColor(post.category)}>
                          {post.category}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          by {post.author}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.timeAgo}
                        </div>
                      </div>

                      <h3
                        className="text-lg font-semibold text-gray-900 hover:text-india-saffron cursor-pointer transition-colors"
                        onClick={() => handlePostClick(post)}
                      >
                        {post.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-2">
                        {post.preview}
                      </p>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div
                          className="flex items-center hover:text-india-saffron cursor-pointer transition-colors"
                          onClick={() => handleReply(post.id, post.title)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.replies} replies
                        </div>
                        <div
                          className={`flex items-center cursor-pointer transition-colors ${
                            post.hasLiked
                              ? "text-india-saffron"
                              : "hover:text-india-saffron"
                          }`}
                          onClick={() => handleLike(post.id)}
                        >
                          <ThumbsUp
                            className={`h-4 w-4 mr-1 ${post.hasLiked ? "fill-current" : ""}`}
                          />
                          {post.likes} likes
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {displayedPosts < filteredPosts.length && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore
                ? "Loading..."
                : `Load More Discussions (${filteredPosts.length - displayedPosts} remaining)`}
            </Button>
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isPostDetailOpen}
        onClose={() => {
          setIsPostDetailOpen(false);
          setSelectedPost(null);
        }}
        onLikePost={handleLike}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onReplyToComment={handleReplyToComment}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </section>
  );
};

export default DiscussionForum;
