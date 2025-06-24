
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Star } from 'lucide-react';

const FeatureComparison = () => {
  const features = [
    {
      feature: "Basic Fraud Reporting",
      web: true,
      mobile: true,
      description: "Submit fraud reports with details"
    },
    {
      feature: "One-Tap Reporting",
      web: false,
      mobile: true,
      description: "Instant reporting with single tap",
      highlight: true
    },
    {
      feature: "Call Recording Integration",
      web: false,
      mobile: true,
      description: "Built-in call recording for evidence",
      highlight: true
    },
    {
      feature: "GPS Location Sharing",
      web: false,
      mobile: true,
      description: "Automatic location detection",
      highlight: true
    },
    {
      feature: "Offline Report Drafting",
      web: false,
      mobile: true,
      description: "Work without internet connection",
      highlight: true
    },
    {
      feature: "Push Notifications",
      web: false,
      mobile: true,
      description: "Real-time alerts and updates",
      highlight: true
    },
    {
      feature: "Report History",
      web: true,
      mobile: true,
      description: "View past submissions"
    },
    {
      feature: "Community Features",
      web: true,
      mobile: true,
      description: "Access community discussions"
    },
    {
      feature: "Educational Resources",
      web: true,
      mobile: true,
      description: "Fraud prevention guides"
    },
    {
      feature: "Real-time Caller ID",
      web: false,
      mobile: true,
      description: "Identify fraud callers instantly",
      highlight: true
    },
    {
      feature: "Biometric Security",
      web: false,
      mobile: true,
      description: "Fingerprint/Face ID protection",
      highlight: true
    }
  ];

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Web vs Mobile: Feature Comparison
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          While our web platform offers comprehensive features, the mobile app provides 
          exclusive capabilities designed for on-the-go fraud protection.
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-india-saffron to-saffron-600 text-white">
          <CardTitle className="text-center text-2xl">Feature Comparison Table</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Web Platform</th>
                  <th className="text-center p-4 font-semibold">Mobile App</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {features.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-b hover:bg-gray-50 ${item.highlight ? 'bg-orange-50' : ''}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        {item.highlight && (
                          <Star className="w-4 h-4 text-india-saffron mr-2" />
                        )}
                        <span className={item.highlight ? 'font-semibold' : ''}>{item.feature}</span>
                      </div>
                    </td>
                    <td className="text-center p-4">
                      {item.web ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {item.mobile ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">
          <Star className="w-4 h-4 text-india-saffron inline mr-1" />
          Features marked with a star are exclusive to the mobile app
        </p>
      </div>
    </section>
  );
};

export default FeatureComparison;
