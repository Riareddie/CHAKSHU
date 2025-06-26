import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportsService } from "@/services/database";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const SubmissionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const { toast } = useToast();

  const testSubmission = async () => {
    setIsLoading(true);
    setLastResult(null);

    try {
      const testData = {
        title: "Test Report - Fake UPI Scam",
        description:
          "This is a test report submission to verify the reporting system is working correctly. The scammer tried to trick me into sending money via UPI by posing as a bank official.",
        fraud_type: "financial_fraud",
        user_id: "test_user_123",
        amount_involved: 1000,
        incident_date: new Date().toISOString(),
        status: "pending",
        currency: "INR",
      };

      const result = await reportsService.create(testData);
      setLastResult(result);

      if (result.success) {
        toast({
          title: "✅ Test Successful!",
          description: "Report submission is working correctly.",
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: result.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error) {
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      toast({
        title: "❌ Test Error",
        description: "Unexpected error during test",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Submission Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Click the button below to test if report submission is working
          correctly.
        </p>

        <Button
          onClick={testSubmission}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Submission"
          )}
        </Button>

        {lastResult && (
          <div
            className={`p-4 rounded-lg border ${
              lastResult.success
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {lastResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <strong>{lastResult.success ? "Success!" : "Failed"}</strong>
            </div>

            {lastResult.success && lastResult.data && (
              <div className="text-sm">
                <p>
                  <strong>Report ID:</strong> {lastResult.data.id}
                </p>
                <p>
                  <strong>Status:</strong> {lastResult.data.status}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(lastResult.data.created_at).toLocaleString()}
                </p>
              </div>
            )}

            {!lastResult.success && (
              <p className="text-sm">
                <strong>Error:</strong> {lastResult.error}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionTest;
