import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Eye, Search, FileText, Users, Shield } from "lucide-react";

const DownloadableResources = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleDownload = (resource: (typeof resources)[0]) => {
    toast({
      title: "Download Started",
      description: `Downloading "${resource.title}" (${resource.size})`,
    });

    // Simulate download
    const link = document.createElement("a");
    link.href = `#download-${resource.title.toLowerCase().replace(/\s+/g, "-")}`;
    link.download = `${resource.title}.${resource.type.toLowerCase()}`;
    link.click();
  };

  const handlePreview = (resource: (typeof resources)[0]) => {
    toast({
      title: "Opening Preview",
      description: `Previewing "${resource.title}"`,
    });

    // In a real app, this would open a preview modal or new tab
    window.open(
      `#preview-${resource.title.toLowerCase().replace(/\s+/g, "-")}`,
      "_blank",
    );
  };

  const resources = [
    {
      title: "Fraud Prevention Poster - Hindi",
      description: "Comprehensive fraud awareness poster for community display",
      type: "PDF",
      size: "2.5 MB",
      downloads: "15,234",
      category: "Posters",
      languages: ["Hindi", "English"],
    },
    {
      title: "Senior Citizen Safety Checklist",
      description: "Easy-to-follow checklist for elderly citizens to stay safe",
      type: "PDF",
      size: "1.8 MB",
      downloads: "8,567",
      category: "Checklists",
      languages: ["Hindi", "English", "Tamil", "Telugu"],
    },
    {
      title: "Digital Payment Safety Guide",
      description: "Complete guide for safe UPI and online banking",
      type: "PDF",
      size: "3.2 MB",
      downloads: "22,101",
      category: "Guides",
      languages: ["Hindi", "English", "Gujarati"],
    },
    {
      title: "Children's Internet Safety Workbook",
      description: "Interactive workbook for kids to learn online safety",
      type: "PDF",
      size: "4.1 MB",
      downloads: "12,890",
      category: "Children",
      languages: ["Hindi", "English"],
    },
    {
      title: "Business Fraud Prevention Kit",
      description: "Comprehensive kit for businesses to prevent fraud",
      type: "ZIP",
      size: "8.7 MB",
      downloads: "5,432",
      category: "Business",
      languages: ["English"],
    },
    {
      title: "Quick Reference Card - Scam Types",
      description: "Pocket-sized card listing common scam types",
      type: "PDF",
      size: "0.8 MB",
      downloads: "31,567",
      category: "Quick Reference",
      languages: ["Hindi", "English", "Punjabi", "Bengali"],
    },
  ];

  const categories = [
    "All",
    "Posters",
    "Checklists",
    "Guides",
    "Children",
    "Business",
    "Quick Reference",
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === "All" || resource.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Downloadable Resources
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access our collection of awareness materials, safety guides, and
          educational resources. All materials are available in multiple Indian
          languages.
        </p>

        {/* Statistics */}
        <div className="flex justify-center space-x-8 mt-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>{resources.length} resources</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>
              {resources
                .reduce(
                  (sum, r) => sum + parseInt(r.downloads.replace(",", "")),
                  0,
                )
                .toLocaleString()}{" "}
              downloads
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span>Free & Secure</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-india-saffron hover:bg-saffron-600"
                : ""
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          Showing {filteredResources.length} of {resources.length} resources
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No resources found matching your criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory("All");
              setSearchTerm("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow group"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <Badge variant="outline" className="bg-white">
                    {resource.type}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm">{resource.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Size: {resource.size}</span>
                    <span>{resource.downloads} downloads</span>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">
                      Available Languages:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {resource.languages.map((lang, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-india-saffron hover:bg-saffron-600"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handlePreview(resource)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mt-12">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Need Help with Resources?
          </h3>
          <p className="text-gray-600 mb-4 max-w-xl mx-auto">
            Having trouble downloading or need resources in a specific language?
            Our support team is here to help.
          </p>
          <Button variant="outline" className="bg-white">
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DownloadableResources;
