// Legacy ProfileOverview - redirects to Enhanced version for better responsive design and database integration
import React from "react";
import EnhancedProfileOverview from "./EnhancedProfileOverview";

const ProfileOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  const userStats = {
    reportsSubmitted: 12,
    communityPoints: 850,
    trustScore: 92,
    memberSince: new Date(2023, 5, 15),
    verificationLevel: "Verified",
    contributions: 28,
    helpfulVotes: 156,
    responseRate: 94,
  };

  const achievements = [
    {
      id: 1,
      title: "First Report",
      description: "Submitted your first fraud report",
      icon: FileText,
      earned: true,
      date: new Date(2023, 5, 16),
    },
    {
      id: 2,
      title: "Community Helper",
      description: "Helped 10+ community members",
      icon: Heart,
      earned: true,
      date: new Date(2023, 7, 22),
    },
    {
      id: 3,
      title: "Fraud Fighter",
      description: "Reported 10+ fraud cases",
      icon: Shield,
      earned: true,
      date: new Date(2023, 9, 5),
    },
    {
      id: 4,
      title: "Top Contributor",
      description: "Among top 10% contributors this month",
      icon: Trophy,
      earned: false,
      progress: 78,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "report",
      title: "Submitted UPI fraud report",
      description: "Report #FR-2024-001234",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "under_review",
    },
    {
      id: 2,
      type: "comment",
      title: "Helped community member",
      description: "Provided advice on suspicious SMS",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: "completed",
    },
    {
      id: 3,
      type: "achievement",
      title: "Earned Fraud Fighter badge",
      description: "Reached 10 fraud reports milestone",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "completed",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "under_review":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVerificationColor = (level: string) => {
    switch (level) {
      case "Verified":
        return "bg-green-100 text-green-800";
      case "Premium":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAvatarUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, you would upload the file to a server
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully.",
        });
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                  alt="Profile"
                />
                <AvatarFallback className="text-lg">
                  {user?.user_metadata?.full_name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={handleAvatarUpload}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.user_metadata?.full_name || "User"}
                  </h2>
                  <Badge
                    className={getVerificationColor(
                      userStats.verificationLevel,
                    )}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {userStats.verificationLevel}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member since {format(userStats.memberSince, "MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    India
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-india-saffron">
                    {userStats.reportsSubmitted}
                  </div>
                  <div className="text-sm text-gray-600">Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-india-saffron">
                    {userStats.communityPoints}
                  </div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-india-saffron">
                    {userStats.trustScore}%
                  </div>
                  <div className="text-sm text-gray-600">Trust Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-india-saffron">
                    {userStats.helpfulVotes}
                  </div>
                  <div className="text-sm text-gray-600">Helpful Votes</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div
                    className={`p-2 rounded-full ${achievement.earned ? "bg-green-100" : "bg-gray-100"}`}
                  >
                    <IconComponent
                      className={`h-5 w-5 ${achievement.earned ? "text-green-600" : "text-gray-400"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                    {achievement.earned && achievement.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Earned on {format(achievement.date, "MMM d, yyyy")}
                      </p>
                    )}
                    {!achievement.earned && achievement.progress && (
                      <div className="mt-2">
                        <Progress
                          value={achievement.progress}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {achievement.progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg border"
              >
                <div className="mt-1">{getStatusIcon(activity.status)}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(activity.timestamp, "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Trust Score Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Trust Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Report Accuracy</span>
                <span className="text-sm text-gray-600">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  Community Engagement
                </span>
                <span className="text-sm text-gray-600">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Response Rate</span>
                <span className="text-sm text-gray-600">
                  {userStats.responseRate}%
                </span>
              </div>
              <Progress value={userStats.responseRate} className="h-2" />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              How to improve your Trust Score
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Submit detailed and accurate fraud reports</li>
              <li>• Engage positively with the community</li>
              <li>• Respond to follow-up questions promptly</li>
              <li>• Help other users with their queries</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOverview;
