
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
  attachments: string[];
}

const SupportTickets = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TKT-001',
      title: 'Unable to upload evidence files',
      description: 'Getting error when trying to upload screenshots as evidence.',
      priority: 'High',
      category: 'Technical',
      status: 'In Progress',
      createdAt: new Date('2024-06-08'),
      updatedAt: new Date('2024-06-09'),
      attachments: ['error-screenshot.png']
    },
    {
      id: 'TKT-002',
      title: 'Question about report status',
      description: 'My report has been pending for 2 weeks. Need status update.',
      priority: 'Medium',
      category: 'General',
      status: 'Resolved',
      createdAt: new Date('2024-06-05'),
      updatedAt: new Date('2024-06-08'),
      attachments: []
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: ''
  });

  const handleCreateTicket = () => {
    if (!formData.title || !formData.description || !formData.priority || !formData.category) return;

    const newTicket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      title: formData.title,
      description: formData.description,
      priority: formData.priority as Ticket['priority'],
      category: formData.category,
      status: 'Open',
      createdAt: new Date(),
      updatedAt: new Date(),
      attachments: []
    };

    setTickets(prev => [newTicket, ...prev]);
    setFormData({ title: '', description: '', priority: '', category: '' });
    setShowCreateForm(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Closed': return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (showCreateForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Support Ticket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief description of your issue"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Account">Account</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Feature Request">Feature Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of your issue"
              rows={4}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Attachments</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Click to upload files or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleCreateTicket} className="flex-1">
              Create Ticket
            </Button>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Support Tickets
          </div>
          <Button onClick={() => setShowCreateForm(true)} size="sm">
            New Ticket
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{ticket.id}</span>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant="outline">{ticket.category}</Badge>
                  </div>
                  <h3 className="font-semibold">{ticket.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(ticket.status)}
                  <span className="text-sm font-medium">{ticket.status}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">{ticket.description}</p>
              
              {ticket.attachments.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-700">Attachments:</span>
                  {ticket.attachments.map((file, index) => (
                    <div key={index} className="text-xs text-blue-600 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {file}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                <span>Created: {ticket.createdAt.toLocaleDateString()}</span>
                <span>Updated: {ticket.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          
          {tickets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No support tickets found.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                Create Your First Ticket
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportTickets;
