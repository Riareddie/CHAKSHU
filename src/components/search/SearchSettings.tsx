
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, RotateCcw } from 'lucide-react';

const SearchSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    autoSuggestions: true,
    voiceSearch: true,
    searchHistory: true,
    realTimeResults: false,
    resultsPerPage: 20,
    defaultSortBy: 'relevance',
    safeSearch: true,
    includeArchived: false,
    searchTimeout: 5000,
    cacheResults: true
  });

  const handleSave = () => {
    localStorage.setItem('search-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your search preferences have been updated successfully.",
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      autoSuggestions: true,
      voiceSearch: true,
      searchHistory: true,
      realTimeResults: false,
      resultsPerPage: 20,
      defaultSortBy: 'relevance',
      safeSearch: true,
      includeArchived: false,
      searchTimeout: 5000,
      cacheResults: true
    };
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All search settings have been reset to default values.",
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Search Settings</h2>
          <p className="text-gray-600">Customize your search experience and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto Suggestions</Label>
                <p className="text-sm text-muted-foreground">
                  Show search suggestions as you type
                </p>
              </div>
              <Switch
                checked={settings.autoSuggestions}
                onCheckedChange={(checked) => updateSetting('autoSuggestions', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Voice Search</Label>
                <p className="text-sm text-muted-foreground">
                  Enable voice-powered search functionality
                </p>
              </div>
              <Switch
                checked={settings.voiceSearch}
                onCheckedChange={(checked) => updateSetting('voiceSearch', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Search History</Label>
                <p className="text-sm text-muted-foreground">
                  Save your search history for quick access
                </p>
              </div>
              <Switch
                checked={settings.searchHistory}
                onCheckedChange={(checked) => updateSetting('searchHistory', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Real-time Results</Label>
                <p className="text-sm text-muted-foreground">
                  Update results as you type (may use more data)
                </p>
              </div>
              <Switch
                checked={settings.realTimeResults}
                onCheckedChange={(checked) => updateSetting('realTimeResults', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base">Default Sort Order</Label>
              <Select
                value={settings.defaultSortBy}
                onValueChange={(value) => updateSetting('defaultSortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="date">Newest First</SelectItem>
                  <SelectItem value="severity">High Severity</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Safe Search</Label>
                <p className="text-sm text-muted-foreground">
                  Filter potentially sensitive content
                </p>
              </div>
              <Switch
                checked={settings.safeSearch}
                onCheckedChange={(checked) => updateSetting('safeSearch', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Include Archived</Label>
                <p className="text-sm text-muted-foreground">
                  Include archived reports in search results
                </p>
              </div>
              <Switch
                checked={settings.includeArchived}
                onCheckedChange={(checked) => updateSetting('includeArchived', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Cache Results</Label>
                <p className="text-sm text-muted-foreground">
                  Cache search results for faster loading
                </p>
              </div>
              <Switch
                checked={settings.cacheResults}
                onCheckedChange={(checked) => updateSetting('cacheResults', checked)}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base">Results Per Page</Label>
              <div className="px-3">
                <Slider
                  value={[settings.resultsPerPage]}
                  onValueChange={(value) => updateSetting('resultsPerPage', value[0])}
                  max={100}
                  min={10}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>10</span>
                  <span>{settings.resultsPerPage}</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Search Timeout (ms)</Label>
              <Input
                type="number"
                value={settings.searchTimeout}
                onChange={(e) => updateSetting('searchTimeout', parseInt(e.target.value))}
                min={1000}
                max={30000}
                step={1000}
              />
              <p className="text-sm text-muted-foreground">
                How long to wait for search results before timing out
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Data Usage</h4>
              <p className="text-sm text-yellow-700">
                Your search data is used to improve the fraud detection system and provide better results. 
                All personal information is anonymized and encrypted.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <Button variant="outline" className="w-full">
                Export Search Data
              </Button>
              <Button variant="outline" className="w-full">
                Clear Search History
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                Delete All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchSettings;
