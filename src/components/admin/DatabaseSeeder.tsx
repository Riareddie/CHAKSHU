import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Download,
  Upload,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  seedDatabase,
  clearSeedData,
  DatabaseSeedingResult,
} from "@/lib/database-seeder";

const DatabaseSeeder: React.FC = () => {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [seedResult, setSeedResult] = useState<DatabaseSeedingResult | null>(
    null,
  );
  const [clearResult, setClearResult] = useState<DatabaseSeedingResult | null>(
    null,
  );
  const [progress, setProgress] = useState(0);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setProgress(0);
    setSeedResult(null);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await seedDatabase();

      clearInterval(progressInterval);
      setProgress(100);

      setSeedResult(result);

      if (result.success) {
        toast({
          title: "Database Seeded Successfully",
          description: result.message,
        });
      } else {
        toast({
          title: "Seeding Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Seeding Error",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const handleClearSeedData = async () => {
    setIsClearing(true);
    setClearResult(null);

    try {
      const result = await clearSeedData();
      setClearResult(result);

      if (result.success) {
        toast({
          title: "Seed Data Cleared",
          description: result.message,
        });
      } else {
        toast({
          title: "Clear Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Clear Error",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Seeding Management
          </CardTitle>
          <CardDescription>
            Populate the database with sample fraud reports, notifications, and
            other essential data for development and demo purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Information Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Database seeding will only work if
              you're authenticated and Supabase is properly configured. This
              operation will create sample data including fraud reports,
              notifications, user preferences, and community interactions.
            </AlertDescription>
          </Alert>

          {/* Progress Indicator */}
          {isSeeding && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Seeding Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSeedDatabase}
              disabled={isSeeding || isClearing}
              className="flex items-center gap-2"
            >
              {isSeeding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isSeeding ? "Seeding Database..." : "Seed Database"}
            </Button>

            <Button
              variant="destructive"
              onClick={handleClearSeedData}
              disabled={isSeeding || isClearing}
              className="flex items-center gap-2"
            >
              {isClearing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isClearing ? "Clearing Data..." : "Clear Seed Data"}
            </Button>
          </div>

          <Separator />

          {/* Seeding Results */}
          {seedResult && (
            <div className="space-y-4">
              <h4 className="font-semibold">Last Seeding Operation</h4>
              <Alert
                className={
                  seedResult.success
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }
              >
                {seedResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p
                      className={
                        seedResult.success ? "text-green-800" : "text-red-800"
                      }
                    >
                      {seedResult.message}
                    </p>

                    {seedResult.details && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {seedResult.details.reports || 0}
                          </div>
                          <div className="text-xs text-gray-600">Reports</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {seedResult.details.notifications || 0}
                          </div>
                          <div className="text-xs text-gray-600">
                            Notifications
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {seedResult.details.userPreferences || 0}
                          </div>
                          <div className="text-xs text-gray-600">
                            Preferences
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {seedResult.details.interactions || 0}
                          </div>
                          <div className="text-xs text-gray-600">
                            Interactions
                          </div>
                        </div>
                      </div>
                    )}

                    {seedResult.errors && seedResult.errors.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-red-700 mb-2">
                          Errors encountered:
                        </p>
                        <ul className="text-sm text-red-600 space-y-1">
                          {seedResult.errors.map((error, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-400">•</span>
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Clear Results */}
          {clearResult && (
            <div className="space-y-4">
              <h4 className="font-semibold">Last Clear Operation</h4>
              <Alert
                className={
                  clearResult.success
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }
              >
                {clearResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription
                  className={
                    clearResult.success ? "text-green-800" : "text-red-800"
                  }
                >
                  {clearResult.message}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* What Gets Seeded */}
          <div className="space-y-4">
            <h4 className="font-semibold">What Gets Seeded</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="w-fit">
                  <Database className="h-3 w-3 mr-1" />
                  Reports Table
                </Badge>
                <p className="text-sm text-gray-600">
                  Sample fraud reports with various types, statuses, and
                  amounts. Includes geographic data for Indian cities.
                </p>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="w-fit">
                  <Database className="h-3 w-3 mr-1" />
                  Notifications Table
                </Badge>
                <p className="text-sm text-gray-600">
                  Welcome messages, fraud alerts, case updates, and security
                  tips for the authenticated user.
                </p>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="w-fit">
                  <Database className="h-3 w-3 mr-1" />
                  User Preferences
                </Badge>
                <p className="text-sm text-gray-600">
                  Dashboard filter preferences and notification settings for the
                  current user.
                </p>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="w-fit">
                  <Database className="h-3 w-3 mr-1" />
                  Community Data
                </Badge>
                <p className="text-sm text-gray-600">
                  Sample community interactions, comments, and helpful responses
                  on reports.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseSeeder;
