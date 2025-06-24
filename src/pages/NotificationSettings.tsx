
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Mail, MessageSquare, Shield, Users, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    // Push Notifications
    pushEnabled: true,
    caseUpdates: true,
    communityAlerts: true,
    systemAnnouncements: false,
    fraudWarnings: true,
    
    // Email Notifications
    emailEnabled: true,
    emailCaseUpdates: true,
    emailCommunityAlerts: false,
    emailSystemAnnouncements: true,
    emailFraudWarnings: true,
    
    // SMS Notifications
    smsEnabled: false,
    smsCaseUpdates: false,
    smsCommunityAlerts: false,
    smsSystemAnnouncements: false,
    smsFraudWarnings: true
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    console.log('Saving notification settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-gray-600">Manage how you receive alerts and updates</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <CardDescription>
                Real-time browser notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-enabled" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Enable Push Notifications
                </Label>
                <Switch
                  id="push-enabled"
                  checked={settings.pushEnabled}
                  onCheckedChange={(value) => handleSettingChange('pushEnabled', value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-case" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Case Updates
                  </Label>
                  <Switch
                    id="push-case"
                    checked={settings.caseUpdates}
                    onCheckedChange={(value) => handleSettingChange('caseUpdates', value)}
                    disabled={!settings.pushEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-community" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Community Alerts
                  </Label>
                  <Switch
                    id="push-community"
                    checked={settings.communityAlerts}
                    onCheckedChange={(value) => handleSettingChange('communityAlerts', value)}
                    disabled={!settings.pushEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-system" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    System Announcements
                  </Label>
                  <Switch
                    id="push-system"
                    checked={settings.systemAnnouncements}
                    onCheckedChange={(value) => handleSettingChange('systemAnnouncements', value)}
                    disabled={!settings.pushEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-fraud" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Fraud Warnings
                  </Label>
                  <Switch
                    id="push-fraud"
                    checked={settings.fraudWarnings}
                    onCheckedChange={(value) => handleSettingChange('fraudWarnings', value)}
                    disabled={!settings.pushEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Receive updates via email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-enabled" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Enable Email Notifications
                </Label>
                <Switch
                  id="email-enabled"
                  checked={settings.emailEnabled}
                  onCheckedChange={(value) => handleSettingChange('emailEnabled', value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-case" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Case Updates
                  </Label>
                  <Switch
                    id="email-case"
                    checked={settings.emailCaseUpdates}
                    onCheckedChange={(value) => handleSettingChange('emailCaseUpdates', value)}
                    disabled={!settings.emailEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-community" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Community Alerts
                  </Label>
                  <Switch
                    id="email-community"
                    checked={settings.emailCommunityAlerts}
                    onCheckedChange={(value) => handleSettingChange('emailCommunityAlerts', value)}
                    disabled={!settings.emailEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-system" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    System Announcements
                  </Label>
                  <Switch
                    id="email-system"
                    checked={settings.emailSystemAnnouncements}
                    onCheckedChange={(value) => handleSettingChange('emailSystemAnnouncements', value)}
                    disabled={!settings.emailEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-fraud" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Fraud Warnings
                  </Label>
                  <Switch
                    id="email-fraud"
                    checked={settings.emailFraudWarnings}
                    onCheckedChange={(value) => handleSettingChange('emailFraudWarnings', value)}
                    disabled={!settings.emailEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                SMS Notifications
              </CardTitle>
              <CardDescription>
                Receive urgent alerts via SMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-enabled" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Enable SMS Notifications
                </Label>
                <Switch
                  id="sms-enabled"
                  checked={settings.smsEnabled}
                  onCheckedChange={(value) => handleSettingChange('smsEnabled', value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-case" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Case Updates
                  </Label>
                  <Switch
                    id="sms-case"
                    checked={settings.smsCaseUpdates}
                    onCheckedChange={(value) => handleSettingChange('smsCaseUpdates', value)}
                    disabled={!settings.smsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-community" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Community Alerts
                  </Label>
                  <Switch
                    id="sms-community"
                    checked={settings.smsCommunityAlerts}
                    onCheckedChange={(value) => handleSettingChange('smsCommunityAlerts', value)}
                    disabled={!settings.smsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-system" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    System Announcements
                  </Label>
                  <Switch
                    id="sms-system"
                    checked={settings.smsSystemAnnouncements}
                    onCheckedChange={(value) => handleSettingChange('smsSystemAnnouncements', value)}
                    disabled={!settings.smsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-fraud" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Fraud Warnings
                  </Label>
                  <Switch
                    id="sms-fraud"
                    checked={settings.smsFraudWarnings}
                    onCheckedChange={(value) => handleSettingChange('smsFraudWarnings', value)}
                    disabled={!settings.smsEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button onClick={saveSettings} className="bg-india-saffron hover:bg-saffron-600 text-white px-8">
            Save Settings
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationSettings;
