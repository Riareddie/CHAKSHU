
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Download, Share2, CheckCircle, Lock, Star } from "lucide-react";

interface Certification {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'expert';
  requirements: {
    scenarios: number;
    minScore: number;
    timeLimit?: number;
  };
  badge: string;
  skills: string[];
  earned: boolean;
  earnedDate?: string;
  progress: {
    scenarios: number;
    score: number;
  };
}

interface CertificationCenterProps {
  userProgress: any;
}

const CertificationCenter = ({ userProgress }: CertificationCenterProps) => {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const certifications: Certification[] = [
    {
      id: 'fraud-awareness-basic',
      name: 'Fraud Awareness - Basic',
      description: 'Demonstrates basic understanding of common fraud patterns and prevention techniques.',
      level: 'beginner',
      requirements: {
        scenarios: 5,
        minScore: 70
      },
      badge: '🛡️',
      skills: ['Basic Pattern Recognition', 'Phone Fraud Detection', 'SMS Scam Identification'],
      earned: userProgress.completedScenarios >= 5 && userProgress.score >= 70,
      earnedDate: userProgress.completedScenarios >= 5 ? '2024-01-15' : undefined,
      progress: {
        scenarios: Math.min(userProgress.completedScenarios, 5),
        score: userProgress.score
      }
    },
    {
      id: 'fraud-detective-intermediate',
      name: 'Fraud Detective - Intermediate',
      description: 'Advanced fraud detection skills with ability to analyze complex scenarios.',
      level: 'intermediate',
      requirements: {
        scenarios: 15,
        minScore: 200,
        timeLimit: 30
      },
      badge: '🕵️',
      skills: ['Advanced Pattern Analysis', 'Audio Fraud Detection', 'Email Scam Analysis', 'Investment Fraud Recognition'],
      earned: userProgress.completedScenarios >= 15 && userProgress.score >= 200,
      earnedDate: undefined,
      progress: {
        scenarios: Math.min(userProgress.completedScenarios, 15),
        score: userProgress.score
      }
    },
    {
      id: 'fraud-expert-master',
      name: 'Fraud Prevention Expert',
      description: 'Master level certification for fraud prevention specialists and educators.',
      level: 'expert',
      requirements: {
        scenarios: 30,
        minScore: 500,
        timeLimit: 20
      },
      badge: '🎖️',
      skills: ['Expert Pattern Recognition', 'Complex Fraud Analysis', 'Teaching & Mentoring', 'Policy Understanding'],
      earned: false,
      earnedDate: undefined,
      progress: {
        scenarios: Math.min(userProgress.completedScenarios, 30),
        score: userProgress.score
      }
    }
  ];

  const handleDownloadCertificate = (cert: Certification) => {
    // In a real implementation, this would generate and download a PDF certificate
    console.log('Downloading certificate for:', cert.name);
    
    // Create a mock certificate download
    const element = document.createElement('a');
    const file = new Blob([`Certificate of Completion\n\n${cert.name}\n\nAwarded to: User\nDate: ${cert.earnedDate}\n\nThis certifies that the holder has successfully completed the requirements for ${cert.name}.`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${cert.name.replace(/\s+/g, '_')}_Certificate.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShareCertificate = (cert: Certification) => {
    if (navigator.share) {
      navigator.share({
        title: `I earned the ${cert.name} certification!`,
        text: `I've successfully completed the ${cert.name} certification in fraud prevention.`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `I earned the ${cert.name} certification in fraud prevention! 🎉`;
      navigator.clipboard.writeText(text);
      alert('Certificate shared to clipboard!');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (current: number, required: number) => {
    return Math.min((current / required) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Certification Center</h2>
        <p className="text-gray-600">
          Earn official certifications to validate your fraud prevention expertise
        </p>
      </div>

      {/* Earned Certificates Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {certifications.filter(c => c.earned).length}
              </div>
              <p className="text-sm text-green-700">Certificates Earned</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {certifications.filter(c => !c.earned && getProgressPercentage(c.progress.scenarios, c.requirements.scenarios) > 50).length}
              </div>
              <p className="text-sm text-blue-700">In Progress</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {certifications.reduce((acc, cert) => acc + cert.skills.length, 0)}
              </div>
              <p className="text-sm text-purple-700">Skills Validated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certification Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <Card key={cert.id} className={`relative ${cert.earned ? 'border-green-500' : ''}`}>
            {cert.earned && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            )}
            
            <CardHeader>
              <div className="text-center">
                <div className="text-4xl mb-2">{cert.badge}</div>
                <CardTitle className="text-lg">{cert.name}</CardTitle>
                <Badge className={getLevelColor(cert.level)}>
                  {cert.level}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                {cert.description}
              </p>

              {/* Requirements */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Requirements:</h4>
                
                {/* Scenarios Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Scenarios Completed</span>
                    <span>{cert.progress.scenarios} / {cert.requirements.scenarios}</span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(cert.progress.scenarios, cert.requirements.scenarios)} 
                    className="h-2" 
                  />
                </div>

                {/* Score Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Minimum Score</span>
                    <span>{cert.progress.score} / {cert.requirements.minScore}</span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(cert.progress.score, cert.requirements.minScore)} 
                    className="h-2" 
                  />
                </div>

                {cert.requirements.timeLimit && (
                  <div className="text-sm text-gray-600">
                    ⏱️ Average time limit: {cert.requirements.timeLimit}s per scenario
                  </div>
                )}
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Skills Validated:</h4>
                <div className="flex flex-wrap gap-1">
                  {cert.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t space-y-2">
                {cert.earned ? (
                  <div className="space-y-2">
                    <div className="text-center text-sm text-green-600 font-medium">
                      ✅ Earned on {cert.earnedDate}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownloadCertificate(cert)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleShareCertificate(cert)}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    {getProgressPercentage(cert.progress.scenarios, cert.requirements.scenarios) >= 100 && 
                     getProgressPercentage(cert.progress.score, cert.requirements.minScore) >= 100 ? (
                      <Button className="w-full bg-india-saffron hover:bg-saffron-600">
                        <Award className="w-4 h-4 mr-2" />
                        Claim Certificate
                      </Button>
                    ) : (
                      <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                        <Lock className="w-4 h-4" />
                        Complete requirements to unlock
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Certificate Templates Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-gray-700">CERTIFICATE OF COMPLETION</div>
              <div className="text-lg text-gray-600">Fraud Prevention Certification</div>
              <div className="text-4xl">🎖️</div>
              <div className="text-xl font-semibold">Your Name</div>
              <div className="text-gray-600">
                has successfully completed the requirements for<br />
                <span className="font-semibold">Fraud Detective - Intermediate</span>
              </div>
              <div className="text-sm text-gray-500">
                Issued by Chakshu Shield India • Date: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Preview of your downloadable certificate
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificationCenter;
