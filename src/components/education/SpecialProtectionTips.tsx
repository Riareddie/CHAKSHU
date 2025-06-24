
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SpecialProtectionTips = () => {
  const seniorTips = [
    {
      category: "Phone Scams",
      tips: [
        "Never give personal information over the phone",
        "Be suspicious of urgent requests for money",
        "Hang up and call back on official numbers",
        "Don't trust caller ID - it can be faked"
      ]
    },
    {
      category: "Online Safety",
      tips: [
        "Use strong, unique passwords",
        "Be cautious of social media friend requests",
        "Don't click on suspicious links",
        "Keep software updated"
      ]
    },
    {
      category: "Financial Protection",
      tips: [
        "Monitor bank statements regularly",
        "Set up account alerts",
        "Use official banking apps only",
        "Never share OTP with anyone"
      ]
    },
    {
      category: "Door-to-Door Scams",
      tips: [
        "Don't let strangers into your home",
        "Ask for official identification",
        "Be wary of high-pressure sales tactics",
        "Consult family before making decisions"
      ]
    }
  ];

  const emergencyContacts = [
    { name: "Cyber Crime Helpline", number: "1930" },
    { name: "Senior Citizen Helpline", number: "14567" },
    { name: "Police Emergency", number: "100" },
    { name: "Women Helpline", number: "181" }
  ];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Senior Citizen Special Protection
          </CardTitle>
          <p className="text-gray-600 text-center">
            Comprehensive safety tips specifically designed for elderly citizens
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {seniorTips.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-3 text-india-saffron">
                  {section.category}
                </h3>
                <div className="grid gap-2">
                  {section.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Alert>
              <AlertDescription>
                <strong>Remember:</strong> If something seems too good to be true, it probably is. 
                When in doubt, always consult with a trusted family member or friend.
              </AlertDescription>
            </Alert>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3">Emergency Contacts</h4>
              <div className="grid grid-cols-2 gap-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-red-700">{contact.name}</div>
                    <div className="font-bold text-lg text-red-800">{contact.number}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialProtectionTips;
