
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ChildrenSafetySection = () => {
  const ageGroups = [
    {
      age: "5-8 Years",
      rules: [
        "Never share your name or address online",
        "Only use websites parents approve",
        "Tell parents if someone asks to meet you",
        "Don't download anything without permission"
      ],
      activities: ["Safe Website List", "Parental Control Guide"]
    },
    {
      age: "9-12 Years",
      rules: [
        "Don't accept friend requests from strangers",
        "Never share passwords with friends",
        "Be careful what you post online",
        "Report cyberbullying immediately"
      ],
      activities: ["Online Safety Quiz", "Social Media Guide"]
    },
    {
      age: "13-17 Years",
      rules: [
        "Think before you post - it's permanent",
        "Be aware of online predators",
        "Don't share financial information",
        "Use privacy settings on all accounts"
      ],
      activities: ["Digital Footprint Checker", "Privacy Settings Tutorial"]
    }
  ];

  const parentTips = [
    "Set up parental controls on devices",
    "Keep computers in common areas",
    "Regularly check browsing history",
    "Educate about online dangers",
    "Create a family internet agreement",
    "Monitor social media accounts"
  ];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Children's Internet Safety
          </CardTitle>
          <p className="text-gray-600 text-center">
            Age-appropriate safety guidelines for children and teens
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {ageGroups.map((group, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-india-saffron">
                  {group.age}
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Safety Rules:</h4>
                    <div className="space-y-1">
                      {group.rules.map((rule, ruleIndex) => (
                        <div key={ruleIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Learning Activities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.activities.map((activity, actIndex) => (
                        <Button key={actIndex} variant="outline" size="sm">
                          {activity}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-3">Tips for Parents</h4>
              <div className="grid gap-2">
                {parentTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-purple-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-3">
              <Button className="w-full">Download Kids Safety Workbook</Button>
              <Button variant="outline" className="w-full">Family Internet Agreement Template</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildrenSafetySection;
