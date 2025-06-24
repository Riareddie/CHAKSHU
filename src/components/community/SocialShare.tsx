import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share,
  Twitter,
  Facebook,
  MessageCircle,
  Copy,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SocialShare = () => {
  const { toast } = useToast();

  const shareContent = {
    title: "Join the fight against fraud! 🛡️",
    description:
      "Protecting India from digital fraud through community action. Report scams, share alerts, save lives.",
    url: window.location.origin,
    hashtags:
      "#FraudPrevention #DigitalIndia #CyberSafety #CommunityProtection",
  };

  const handleShareCampaign = (campaign: any) => {
    const shareText = `Help spread awareness! Join the "${campaign.title}" campaign. ${campaign.description} ${campaign.hashtag}`;
    const shareUrl = window.location.origin + "/community";

    if (navigator.share) {
      navigator
        .share({
          title: campaign.title,
          text: shareText,
          url: shareUrl,
        })
        .then(() => {
          toast({
            title: "Campaign Shared!",
            description:
              "Thank you for helping spread awareness about fraud prevention.",
          });
        })
        .catch(() => {
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          toast({
            title: "Link Copied!",
            description: "Campaign link copied to clipboard.",
          });
        });
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast({
        title: "Link Copied!",
        description: "Campaign link copied to clipboard.",
      });
    }
  };

  const getProgressPercentage = (current: string, target: string) => {
    const currentNum = parseFloat(current.replace(/[^\d.]/g, ""));
    const targetNum = parseFloat(target.replace(/[^\d.]/g, ""));
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  const campaigns = [
    {
      id: 1,
      title: "Fraud Awareness Week",
      description: "Share your fraud prevention knowledge with 5 friends",
      target: "1M Shares",
      current: "750K",
      hashtag: "#FraudAwarenessWeek",
    },
    {
      id: 2,
      title: "Protect Seniors Campaign",
      description: "Help elderly family members recognize scams",
      target: "500K Shares",
      current: "320K",
      hashtag: "#ProtectSeniors",
    },
    {
      id: 3,
      title: "Student Safety Drive",
      description: "Educate students about online fraud risks",
      target: "300K Shares",
      current: "180K",
      hashtag: "#StudentSafety",
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareContent.url);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard.",
    });
  };

  const handleTwitterShare = () => {
    const text = `${shareContent.title}\n${shareContent.description}\n${shareContent.hashtags}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareContent.url)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.url)}`;
    window.open(url, "_blank", "width=580,height=470");
  };

  const handleWhatsAppShare = () => {
    const text = `${shareContent.title}\n${shareContent.description}\n${shareContent.url}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareContent.title);
    const body = encodeURIComponent(
      `${shareContent.description}\n\nJoin the community: ${shareContent.url}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Spread Awareness
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help us reach more people and build a safer digital India. Share fraud
          prevention awareness with your network.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Social Share Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Share className="h-5 w-5 text-india-saffron mr-2" />
              Share on Social Media
            </CardTitle>
            <p className="text-gray-600">
              Spread awareness about fraud prevention in your community
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                {shareContent.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {shareContent.description}
              </p>
              <Badge variant="outline" className="text-xs">
                {shareContent.hashtags}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleTwitterShare}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                onClick={handleFacebookShare}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button
                onClick={handleWhatsAppShare}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                onClick={handleEmailShare}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>

            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Share Link
            </Button>
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Active Campaigns
            </CardTitle>
            <p className="text-gray-600">
              Join our ongoing awareness campaigns
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">
                    {campaign.title}
                  </h4>
                  <Badge className="bg-india-saffron text-white">
                    {campaign.hashtag}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600">{campaign.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {campaign.current} / {campaign.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-india-saffron h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${getProgressPercentage(campaign.current, campaign.target)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleShareCampaign(campaign.title)}
                >
                  Share Campaign
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Impact Stats */}
      <div className="mt-8 grid md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-india-saffron">2.3M+</div>
          <div className="text-sm text-gray-600">Content Shares</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-india-saffron">850K+</div>
          <div className="text-sm text-gray-600">People Reached</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-india-saffron">45K+</div>
          <div className="text-sm text-gray-600">New Sign-ups</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-india-saffron">92%</div>
          <div className="text-sm text-gray-600">Engagement Rate</div>
        </div>
      </div>
    </section>
  );
};

export default SocialShare;
