
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Users, Phone, Mail, Globe, AlertTriangle } from 'lucide-react';

const NetworkMapping = () => {
  const [selectedNetwork, setSelectedNetwork] = useState(1);

  const networkData = [
    {
      id: 1,
      name: 'Investment Scam Ring Alpha',
      centerNode: '+91-98765-43210',
      nodeCount: 47,
      connectionCount: 156,
      riskLevel: 'Critical',
      discovered: '2024-01-15',
      nodes: [
        { id: 1, type: 'phone', value: '+91-98765-43210', risk: 'high', connections: 23 },
        { id: 2, type: 'email', value: 'invest.guru@tempmail.com', risk: 'high', connections: 18 },
        { id: 3, type: 'website', value: 'quick-profits.xyz', risk: 'critical', connections: 31 },
        { id: 4, type: 'phone', value: '+91-87654-32109', risk: 'medium', connections: 12 },
        { id: 5, type: 'email', value: 'support@quick-profits.xyz', risk: 'high', connections: 15 }
      ]
    },
    {
      id: 2,
      name: 'Phishing Campaign Beta',
      centerNode: 'bank-verify.online',
      nodeCount: 23,
      connectionCount: 89,
      riskLevel: 'High',
      discovered: '2024-01-18',
      nodes: [
        { id: 1, type: 'website', value: 'bank-verify.online', risk: 'critical', connections: 28 },
        { id: 2, type: 'email', value: 'security@bank-verify.online', risk: 'high', connections: 19 },
        { id: 3, type: 'phone', value: '+91-76543-21098', risk: 'medium', connections: 8 },
        { id: 4, type: 'website', value: 'verify-account.net', risk: 'high', connections: 14 },
        { id: 5, type: 'email', value: 'alerts@verify-account.net', risk: 'medium', connections: 7 }
      ]
    }
  ];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'website': return <Globe className="w-4 h-4" />;
      default: return <Network className="w-4 h-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const currentNetwork = networkData.find(n => n.id === selectedNetwork);

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Fraud Network Mapping Visualization</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          AI analyzes connections between fraudulent entities, revealing complex networks 
          and helping identify coordinated fraud campaigns across multiple channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Networks</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">27</div>
            <p className="text-xs text-muted-foreground">Identified fraud rings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <p className="text-xs text-muted-foreground">Connected entities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3,892</div>
            <p className="text-xs text-muted-foreground">Cross-references found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Clusters</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground">High-risk networks</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5 text-purple-600" />
              Network Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {networkData.map((network) => (
                <div 
                  key={network.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedNetwork === network.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedNetwork(network.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{network.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      network.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {network.riskLevel}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Center: {network.centerNode}</div>
                    <div>{network.nodeCount} nodes, {network.connectionCount} connections</div>
                    <div>Discovered: {network.discovered}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-600" />
                {currentNetwork?.name} - Network Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-50 rounded-lg p-8 h-80">
                {/* Simplified network visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Center node */}
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-4 border-red-600 shadow-lg z-20">
                    CENTER
                  </div>
                  
                  {/* Connected nodes positioned around center */}
                  {currentNetwork?.nodes.map((node, index) => {
                    const angle = (index * 360) / currentNetwork.nodes.length;
                    const radius = 100;
                    const x = radius * Math.cos((angle * Math.PI) / 180);
                    const y = radius * Math.sin((angle * Math.PI) / 180);
                    
                    return (
                      <div key={node.id}>
                        {/* Connection line */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                          <line
                            x1="50%"
                            y1="50%"
                            x2={`calc(50% + ${x}px)`}
                            y2={`calc(50% + ${y}px)`}
                            stroke="#94a3b8"
                            strokeWidth="2"
                            strokeDasharray="4,4"
                          />
                        </svg>
                        
                        {/* Node */}
                        <div
                          className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 shadow-md z-20 ${
                            node.risk === 'critical' ? 'bg-red-500 border-red-600' :
                            node.risk === 'high' ? 'bg-orange-500 border-orange-600' :
                            node.risk === 'medium' ? 'bg-yellow-500 border-yellow-600' :
                            'bg-green-500 border-green-600'
                          }`}
                          style={{
                            left: `calc(50% + ${x}px - 20px)`,
                            top: `calc(50% + ${y}px - 20px)`
                          }}
                          title={node.value}
                        >
                          {getNodeIcon(node.type)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Network Entities:</h4>
                <div className="space-y-2">
                  {currentNetwork?.nodes.map((node) => (
                    <div key={node.id} className={`p-3 border rounded-lg ${getRiskColor(node.risk)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getNodeIcon(node.type)}
                          <span className="font-medium text-sm">{node.value}</span>
                        </div>
                        <div className="text-right text-xs">
                          <div className="font-semibold">{node.connections} connections</div>
                          <div className="capitalize">{node.risk} risk</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Network Analysis Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">Critical Findings</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Cross-platform coordination detected</li>
                <li>• Shared infrastructure across campaigns</li>
                <li>• Coordinated timing patterns identified</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Pattern Analysis</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Similar messaging templates used</li>
                <li>• Common hosting providers identified</li>
                <li>• Overlapping contact databases found</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Preventive Actions</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Proactive blocking implemented</li>
                <li>• Network monitoring active</li>
                <li>• Cross-agency intelligence shared</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default NetworkMapping;
