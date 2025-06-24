
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Users, Link, AlertCircle } from 'lucide-react';

const DuplicateDetection = () => {
  const duplicateGroups = [
    {
      id: 1,
      similarity: 98,
      count: 247,
      type: 'Investment Scam',
      template: 'Urgent! Limited time offer to invest in cryptocurrency...',
      variants: [
        'Urgent! Limited time offer to invest in bitcoin...',
        'URGENT! Limited time offer to invest in crypto...',
        'Urgent! Limited offer to invest in cryptocurrency...'
      ],
      channels: ['SMS', 'Email', 'WhatsApp'],
      firstSeen: '2024-01-15',
      lastSeen: '2024-01-20'
    },
    {
      id: 2,
      similarity: 94,
      count: 189,
      type: 'Prize Winner',
      template: 'Congratulations! You have won ₹50,000 in our lottery...',
      variants: [
        'Congratulations! You have won ₹1,00,000 in our lottery...',
        'Congratulations! You won ₹50,000 in lottery...',
        'Congratulations! You have won Rs.50,000 in our draw...'
      ],
      channels: ['SMS', 'Call'],
      firstSeen: '2024-01-18',
      lastSeen: '2024-01-20'
    },
    {
      id: 3,
      similarity: 91,
      count: 156,
      type: 'Bank Alert',
      template: 'Your account will be blocked. Verify immediately...',
      variants: [
        'Your account will be suspended. Verify now...',
        'Your bank account will be blocked. Verify details...',
        'Account will be closed. Verify immediately...'
      ],
      channels: ['SMS', 'Email'],
      firstSeen: '2024-01-19',
      lastSeen: '2024-01-20'
    }
  ];

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 95) return 'text-red-600 bg-red-100';
    if (similarity >= 90) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Smart Duplicate Detection System</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Advanced AI algorithms identify similar fraud patterns across different channels, 
          detecting variations and mutations of known scam templates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duplicate Groups</CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">1,247</div>
            <p className="text-xs text-muted-foreground">Identified patterns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Variants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8,924</div>
            <p className="text-xs text-muted-foreground">Detected variations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cross-Channel</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">734</div>
            <p className="text-xs text-muted-foreground">Multi-platform scams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Similarity</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">94.2%</div>
            <p className="text-xs text-muted-foreground">Pattern matching</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {duplicateGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Copy className="w-5 h-5 text-purple-600" />
                  {group.type} Pattern Group
                </CardTitle>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSimilarityColor(group.similarity)}`}>
                    {group.similarity}% Similar
                  </span>
                  <span className="text-sm text-gray-600">{group.count} variants</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Base Template:</h4>
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                  {group.template}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Detected Variants:</h4>
                <div className="space-y-2">
                  {group.variants.map((variant, index) => (
                    <div key={index} className="bg-red-50 p-2 rounded border-l-4 border-red-400 text-sm">
                      {variant}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Channels:</span>
                  <div className="flex gap-1 mt-1">
                    {group.channels.map((channel) => (
                      <span key={channel} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">First Seen:</span>
                  <div className="text-gray-600">{group.firstSeen}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Seen:</span>
                  <div className="text-gray-600">{group.lastSeen}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total Reports:</span>
                  <div className="text-gray-600">{group.count}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default DuplicateDetection;
