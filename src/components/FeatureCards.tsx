import { Bell } from "lucide-react";
import LearnMoreButton from "@/components/common/LearnMoreButton";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeatureCards = () => {
  const { user } = useAuth();

  const authenticatedFeatures = [
    {
      title: "My Dashboard",
      description:
        "View your personal fraud reports, track statuses, and monitor your contribution to fraud prevention.",
      icon: "📊",
      color: "from-emerald-500 to-emerald-600",
      link: "/dashboard",
      buttonText: "View Dashboard",
    },
    {
      title: "Report Management",
      description:
        "Manage all your submitted fraud reports, track their progress, and get real-time updates.",
      icon: "📋",
      color: "from-blue-500 to-blue-600",
      link: "/reports-management",
      buttonText: "Manage Reports",
    },
    {
      title: "Community Hub",
      description:
        "Connect with other users, share experiences, and stay updated with community insights and alerts.",
      icon: "👥",
      color: "from-purple-500 to-purple-600",
      link: "/community",
      buttonText: "Join Community",
    },
    {
      title: "Advanced Analytics",
      description:
        "Access personalized insights, fraud trends in your area, and advanced protection recommendations.",
      icon: "🔍",
      color: "from-indigo-500 to-indigo-600",
      link: "/analytics",
      buttonText: "View Analytics",
    },
  ];

  const publicFeatures = [
    {
      title: "Fraud Prevention",
      description:
        "Learn about the latest fraud tactics and how to protect yourself from scammers with expert tips and strategies.",
      icon: "🛡️",
      color: "from-india-saffron to-saffron-600",
      learnMoreType: "fraud-prevention" as const,
    },
    {
      title: "Reporting Process",
      description:
        "Step-by-step guidance on how to report fraud incidents effectively and track your submissions.",
      icon: "📋",
      color: "from-blue-500 to-blue-600",
      learnMoreType: "reporting-process" as const,
    },
    {
      title: "Community Features",
      description:
        "Join our community to share experiences, get alerts, and help others stay safe from fraud.",
      icon: "👥",
      color: "from-india-green to-green-600",
      learnMoreType: "community-features" as const,
    },
    {
      title: "Analytics & Insights",
      description:
        "Access detailed analytics on fraud trends, patterns, and statistics to stay informed about threats.",
      icon: "📊",
      color: "from-purple-500 to-purple-600",
      learnMoreType: "analytics" as const,
    },
  ];

  const features = user ? authenticatedFeatures : publicFeatures;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {user
              ? "Your Fraud Protection Tools"
              : "Powerful Features for Your Protection"}
          </h2>
          <p className="text-xl text-gray-600 dark:text-white max-w-2xl mx-auto">
            {user
              ? "Access your personalized tools and insights for maximum fraud protection"
              : "Everything you need to report, track, and stay protected from fraud"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
              ></div>

              {/* Icon */}
              <div className="relative">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-2xl">{feature.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-800 dark:group-hover:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-white leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Action Button */}
                {user && "link" in feature ? (
                  <Link to={feature.link}>
                    <Button
                      size="sm"
                      className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-white transition-all duration-200`}
                    >
                      {feature.buttonText}
                    </Button>
                  </Link>
                ) : (
                  "learnMoreType" in feature && (
                    <LearnMoreButton
                      variant={feature.learnMoreType}
                      size="sm"
                      className="w-full"
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
