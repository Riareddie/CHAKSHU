
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, AlertTriangle, Shield } from 'lucide-react';

interface RegionalContentProps {
  language: string;
  state: string;
}

const RegionalContent: React.FC<RegionalContentProps> = ({ language, state }) => {
  const getLocalizedContent = () => {
    const content = {
      en: {
        fraudExamples: [
          {
            title: "Fake KYC Update SMS",
            example: "Dear customer, your bank account will be blocked. Update KYC: bit.ly/kyc123",
            warning: "Banks never ask for KYC updates via SMS with shortened links"
          },
          {
            title: "Lottery Scam Call",
            example: "Congratulations! You've won ₹25,00,000 in Kaun Banega Crorepati. Pay ₹5,000 processing fee.",
            warning: "Legitimate lotteries never ask for upfront payment"
          }
        ],
        telecomProviders: ["Airtel", "Jio", "Vi", "BSNL"],
        emergencyContacts: {
          cybercrime: "1930",
          police: "100",
          women: "1091"
        }
      },
      hi: {
        fraudExamples: [
          {
            title: "नकली KYC अपडेट SMS",
            example: "प्रिय ग्राहक, आपका बैंक खाता बंद हो जाएगा। KYC अपडेट करें: bit.ly/kyc123",
            warning: "बैंक कभी भी SMS के द्वारा KYC अपडेट नहीं मांगते"
          },
          {
            title: "लॉटरी घोटाला कॉल",
            example: "बधाई हो! आपने KBC में ₹25,00,000 जीते हैं। ₹5,000 प्रोसेसिंग फीस भुगतान करें।",
            warning: "असली लॉटरी में पहले से पैसे नहीं मांगे जाते"
          }
        ],
        telecomProviders: ["एयरटेल", "जियो", "वाई", "BSNL"],
        emergencyContacts: {
          cybercrime: "1930",
          police: "100", 
          women: "1091"
        }
      }
    };

    return content[language as keyof typeof content] || content.en;
  };

  const getStateSpecificInfo = () => {
    const stateInfo = {
      "Maharashtra": {
        commonFrauds: ["UPI Payment Reversal", "Fake Job Offers", "Investment Schemes"],
        lawEnforcement: {
          cyberCell: "022-2620-1020",
          police: "022-100"
        },
        localProviders: ["Airtel", "Jio", "Vi"]
      },
      "Karnataka": {
        commonFrauds: ["Tech Support Scams", "Online Shopping Fraud", "Romance Scams"],
        lawEnforcement: {
          cyberCell: "080-2294-2233",
          police: "080-100"
        },
        localProviders: ["Jio", "Airtel", "Vi"]
      },
      "Tamil Nadu": {
        commonFrauds: ["Educational Loan Fraud", "Fake Government Schemes", "SIM Cloning"],
        lawEnforcement: {
          cyberCell: "044-2844-3333",
          police: "044-100"
        },
        localProviders: ["Airtel", "Jio", "BSNL"]
      }
    };

    return stateInfo[state as keyof typeof stateInfo] || stateInfo["Maharashtra"];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const content = getLocalizedContent();
  const stateInfo = getStateSpecificInfo();

  return (
    <div className="space-y-6">
      {/* Cultural Context-Aware Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            {language === 'hi' ? 'स्थानीय धोखाधड़ी के उदाहरण' : 'Local Fraud Examples'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.fraudExamples.map((example, index) => (
            <div key={index} className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-700">{example.title}</h4>
              <p className="text-sm text-gray-600 mt-1" dir={language === 'ur' ? 'rtl' : 'ltr'}>
                "{example.example}"
              </p>
              <p className="text-xs text-green-700 mt-2 font-medium">
                ⚠️ {example.warning}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* State-Specific Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-500 mr-2" />
            {language === 'hi' ? `${state} में सामान्य धोखाधड़ी` : `Common Frauds in ${state}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stateInfo.commonFrauds.map((fraud, index) => (
              <Badge key={index} variant="outline" className="justify-center p-2">
                {fraud}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Telecom Provider Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="h-5 w-5 text-green-500 mr-2" />
            {language === 'hi' ? 'स्थानीय टेलीकॉम प्रदाता' : 'Local Telecom Providers'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {content.telecomProviders.map((provider, index) => (
              <Button key={index} variant="outline" size="sm" className="text-center">
                {provider}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {language === 'hi' 
              ? 'धोखाधड़ी की रिपोर्ट के लिए अपने टेलीकॉम प्रदाता से संपर्क करें'
              : 'Contact your telecom provider to report fraud'}
          </p>
        </CardContent>
      </Card>

      {/* Local Law Enforcement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            {language === 'hi' ? 'स्थानीय कानून प्रवर्तन संपर्क' : 'Local Law Enforcement Contacts'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <h4 className="font-semibold text-red-700">
                {language === 'hi' ? 'साइबर अपराध हेल्पलाइन' : 'Cyber Crime Helpline'}
              </h4>
              <p className="text-lg font-bold text-red-600">{content.emergencyContacts.cybercrime}</p>
              <p className="text-sm text-gray-600">{stateInfo.lawEnforcement.cyberCell}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-700">
                {language === 'hi' ? 'पुलिस हेल्पलाइन' : 'Police Helpline'}
              </h4>
              <p className="text-lg font-bold text-blue-600">{content.emergencyContacts.police}</p>
              <p className="text-sm text-gray-600">{stateInfo.lawEnforcement.police}</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold text-green-700">
              {language === 'hi' ? 'महिला हेल्पलाइन' : 'Women Helpline'}
            </h4>
            <p className="text-lg font-bold text-green-600">{content.emergencyContacts.women}</p>
          </div>
        </CardContent>
      </Card>

      {/* Localized Number Examples */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'hi' ? 'स्थानीयकृत संख्या स्वरूपण' : 'Localized Number Formatting'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              {language === 'hi' ? 'सामान्य धोखाधड़ी राशि: ' : 'Common fraud amounts: '}
              <span className="font-semibold">{formatNumber(50000)}, {formatNumber(250000)}, {formatNumber(1000000)}</span>
            </p>
            <p className="text-gray-600">
              {language === 'hi' 
                ? 'भारतीय मुद्रा स्वरूपण का उपयोग करके स्थानीय संदर्भ के लिए'
                : 'Using Indian currency formatting for local context'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionalContent;
