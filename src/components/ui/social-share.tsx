
import React, { useState } from 'react';
import { Share2, Copy, CheckCircle, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { toast } from 'sonner';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  via?: string;
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  url = window.location.href,
  title = 'Chakshu - Shield India | Report Fraud',
  description = 'Help protect citizens by reporting fraud on the official Government of India platform',
  hashtags = ['ChakshuIndia', 'FraudPrevention', 'CyberSecurity', 'IndiaFirst'],
  via = 'IndiaGov',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    text: description,
    url,
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = hashtags.map(tag => encodeURIComponent(tag)).join(',');

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}&via=${via}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${description} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(
      shareUrl,
      'share',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
  };

  const shareOptions = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: shareUrls.twitter,
      color: 'hover:bg-blue-50 hover:text-blue-600',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: shareUrls.facebook,
      color: 'hover:bg-blue-50 hover:text-blue-700',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: shareUrls.whatsapp,
      color: 'hover:bg-green-50 hover:text-green-600',
    },
  ];

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Share this page</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Help spread awareness about fraud prevention
              </p>
            </div>

            {/* Native share (mobile) */}
            {navigator.share && (
              <Button
                onClick={handleNativeShare}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share via device
              </Button>
            )}

            {/* Social media options */}
            <div className="space-y-2">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.name}
                    onClick={() => openShareWindow(option.url)}
                    variant="ghost"
                    className={`w-full justify-start gap-2 ${option.color}`}
                  >
                    <Icon className="h-4 w-4" />
                    Share on {option.name}
                  </Button>
                );
              })}
            </div>

            {/* Copy link */}
            <div className="pt-2 border-t">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="w-full justify-start gap-2"
                disabled={copied}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Link copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </Button>
            </div>

            {/* URL display */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-1">Share URL:</p>
              <div className="bg-muted rounded p-2 text-xs break-all">
                {url}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SocialShare;

// Compact share button for space-constrained areas
export const CompactShareButton: React.FC<{
  url?: string;
  title?: string;
  className?: string;
}> = ({ url, title, className }) => {
  const handleShare = async () => {
    const shareData = {
      title: title || 'Chakshu - Shield India',
      url: url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copy
        try {
          await navigator.clipboard.writeText(shareData.url);
          toast.success('Link copied to clipboard!');
        } catch (error) {
          toast.error('Unable to share');
        }
      }
    } else {
      // Fallback to copy
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Unable to copy link');
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="ghost"
      size="sm"
      className={`gap-1 ${className}`}
    >
      <Share2 className="h-3 w-3" />
      Share
    </Button>
  );
};
