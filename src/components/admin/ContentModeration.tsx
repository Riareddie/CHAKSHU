
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, X, Flag, Eye, AlertTriangle, MessageCircle } from 'lucide-react';

const ContentModeration = () => {
  const [activeTab, setActiveTab] = useState('flagged');

  const flaggedContent = [
    {
      id: "C001",
      type: "Report Comment",
      content: "This is a suspicious comment that may contain inappropriate content...",
      reporter: "Rajesh Kumar",
      reason: "Inappropriate Language",
      date: "2024-01-15 14:30",
      status: "Pending"
    },
    {
      id: "C002",
      type: "Forum Post",
      content: "Discussion about fraud patterns that seems misleading...",
      reporter: "Priya Sharma",
      reason: "Misinformation",
      date: "2024-01-15 13:45",
      status: "Under Review"
    }
  ];

  const autoModResults = [
    {
      id: "AM001",
      action: "Comment Blocked",
      reason: "Spam Detection",
      confidence: "95%",
      timestamp: "2024-01-15 14:28"
    },
    {
      id: "AM002",
      action: "Post Flagged",
      reason: "Inappropriate Content",
      confidence: "87%",
      timestamp: "2024-01-15 13:22"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
              <TabsTrigger value="auto-mod">Auto-Moderation</TabsTrigger>
              <TabsTrigger value="reports">User Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="flagged" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Content Preview</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedContent.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{item.content}</TableCell>
                      <TableCell>{item.reporter}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{item.reason}</Badge>
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="auto-mod" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Auto-Moderation Results</h3>
                  <Button variant="outline">Configure Rules</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action ID</TableHead>
                      <TableHead>Action Taken</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {autoModResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.id}</TableCell>
                        <TableCell>{result.action}</TableCell>
                        <TableCell>{result.reason}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{result.confidence}</Badge>
                        </TableCell>
                        <TableCell>{result.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No user reports pending review</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModeration;
