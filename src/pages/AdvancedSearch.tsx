
import React from 'react';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BarChart3, Settings } from "lucide-react";
import SearchInterface from "@/components/search/SearchInterface";
import SearchAnalytics from "@/components/search/SearchAnalytics";
import SearchSettings from "@/components/search/SearchSettings";

const AdvancedSearch = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Search</h1>
          <p className="text-gray-600">
            Search fraud reports, discussions, and educational content with powerful filters and AI-powered suggestions
          </p>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-6">
            <SearchInterface />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <SearchAnalytics />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SearchSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedSearch;
