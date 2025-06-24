const TrustBadges = () => {
  const badges = [
    {
      title: "Government of India",
      subtitle: "Official Portal",
      icon: "🇮🇳",
    },
    {
      title: "SSL Secured",
      subtitle: "256-bit Encryption",
      icon: "🔒",
    },
    {
      title: "CERT-In Verified",
      subtitle: "Cyber Security",
      icon: "✅",
    },
    {
      title: "Data Protected",
      subtitle: "Privacy Compliant",
      icon: "🛡️",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Trusted by Millions of Indians
          </h2>
          <p className="text-gray-300 dark:text-light-yellow max-w-2xl mx-auto">
            Your security and privacy are our top priorities
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{badge.icon}</div>
              <h3 className="text-white font-semibold mb-1">{badge.title}</h3>
              <p className="text-gray-300 dark:text-light-yellow text-sm">
                {badge.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Government Logos */}
        <div className="text-center mt-12 pt-8 border-t border-white/20 dark:border-white/10">
          <p className="text-gray-400 dark:text-light-yellow text-sm mb-4">
            In partnership with
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-white dark:text-white text-sm font-medium">
              Ministry of Electronics & IT
            </div>
            <div className="text-white dark:text-white text-sm font-medium">
              Department of Telecommunications
            </div>
            <div className="text-white dark:text-white text-sm font-medium">
              TRAI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
