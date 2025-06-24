
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, Bell, Trash2 } from "lucide-react";

interface Reminder {
  id: string;
  reminder_date: string;
  message: string | null;
  is_sent: boolean;
  created_at: string;
}

interface FollowUpRemindersProps {
  reportId: string;
}

const FollowUpReminders = ({ reportId }: FollowUpRemindersProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminderDate, setNewReminderDate] = useState('');
  const [newReminderMessage, setNewReminderMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReminders();
  }, [reportId]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('follow_up_reminders')
        .select('*')
        .eq('report_id', reportId)
        .order('reminder_date', { ascending: true });

      if (error) throw error;
      
      setReminders(data || []);
    } catch (error: any) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReminder = async () => {
    if (!newReminderDate) {
      toast({
        title: "Validation Error",
        description: "Please select a reminder date",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('follow_up_reminders')
        .insert({
          report_id: reportId,
          user_id: user.id,
          reminder_date: newReminderDate,
          message: newReminderMessage || null
        });

      if (error) throw error;

      toast({
        title: "Reminder Created",
        description: "Follow-up reminder has been scheduled successfully",
      });

      setNewReminderDate('');
      setNewReminderMessage('');
      setShowAddForm(false);
      await fetchReminders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('follow_up_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;

      toast({
        title: "Reminder Deleted",
        description: "Follow-up reminder has been removed",
      });

      await fetchReminders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Follow-up Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-india-saffron"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Follow-up Reminders
            </CardTitle>
            <CardDescription>
              Schedule reminders for case follow-ups and updates
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Reminder
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add Reminder Form */}
        {showAddForm && (
          <div className="border rounded-lg p-4 mb-4 bg-gray-50">
            <h4 className="font-medium mb-3">Schedule New Reminder</h4>
            <div className="space-y-3">
              <div>
                <Label>Reminder Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={newReminderDate}
                  onChange={(e) => setNewReminderDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div>
                <Label>Message (Optional)</Label>
                <Textarea
                  value={newReminderMessage}
                  onChange={(e) => setNewReminderMessage(e.target.value)}
                  placeholder="Add a note about what to follow up on..."
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={createReminder}
                  disabled={isCreating}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isCreating && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  )}
                  Create Reminder
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reminders List */}
        {reminders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p>No reminders scheduled</p>
            <p className="text-sm">Add reminders to stay on top of case follow-ups</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className={`border rounded-lg p-3 ${
                  isOverdue(reminder.reminder_date) && !reminder.is_sent
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm">
                      {formatDate(reminder.reminder_date)}
                    </span>
                    {isOverdue(reminder.reminder_date) && !reminder.is_sent && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                    {reminder.is_sent && (
                      <Badge variant="outline" className="text-xs">
                        Sent
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReminder(reminder.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                {reminder.message && (
                  <p className="text-sm text-gray-600 ml-6">
                    {reminder.message}
                  </p>
                )}
                
                <div className="text-xs text-gray-500 ml-6 mt-1">
                  Created: {formatDate(reminder.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowUpReminders;
