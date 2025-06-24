import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalendarIcon,
  Loader2,
  Network,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface ConnectionData {
  id: string;
  number: string;
  operator: string;
  circle: string;
  activationDate: string;
  status: "active" | "inactive";
  isAuthorized: boolean;
}

const TAFCOPService: React.FC = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "+91",
    dateOfBirth: undefined as Date | undefined,
    otp: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);

  // Mock connections data
  const mockConnections: ConnectionData[] = [
    {
      id: "1",
      number: "+919876543210",
      operator: "Airtel",
      circle: "Delhi",
      activationDate: "2023-01-15",
      status: "active",
      isAuthorized: true,
    },
    {
      id: "2",
      number: "+919876543211",
      operator: "Jio",
      circle: "Mumbai",
      activationDate: "2023-06-20",
      status: "active",
      isAuthorized: true,
    },
    {
      id: "3",
      number: "+919876543212",
      operator: "Vi",
      circle: "Bangalore",
      activationDate: "2024-01-10",
      status: "active",
      isAuthorized: false,
    },
  ];

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.mobileNumber || formData.mobileNumber === "+91") {
      newErrors.mobileNumber = "Mobile number is required";
    } else {
      const cleanNumber = formData.mobileNumber.replace(/[\s\-\(\)]/g, "");
      const phonePatterns = [
        /^\+91[6789]\d{9}$/, // +91XXXXXXXXXX
        /^91[6789]\d{9}$/, // 91XXXXXXXXXX
        /^0[6789]\d{9}$/, // 0XXXXXXXXXX
        /^[6789]\d{9}$/, // XXXXXXXXXX
      ];
      const isValid = phonePatterns.some((pattern) =>
        pattern.test(cleanNumber),
      );
      if (!isValid) {
        newErrors.mobileNumber =
          "Please enter a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9)";
      }
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validateStep1()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setOtpSent(true);
      setCurrentStep(2);
      setIsSubmitting(false);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formData.mobileNumber}`,
      });
    }, 2000);
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setConnections(mockConnections);
      setCurrentStep(3);
      setIsSubmitting(false);
      toast({
        title: "Verification Successful",
        description: "Your mobile connections have been retrieved",
      });
    }, 2000);
  };

  const handleBlockConnections = async () => {
    if (selectedConnections.length === 0) {
      toast({
        title: "No Connections Selected",
        description: "Please select connections to block",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setConnections((prev) =>
        prev.map((conn) =>
          selectedConnections.includes(conn.id)
            ? { ...conn, status: "inactive" as const }
            : conn,
        ),
      );
      setSelectedConnections([]);
      setIsSubmitting(false);
      toast({
        title: "Connections Blocked",
        description: `${selectedConnections.length} unauthorized connections have been blocked`,
      });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleConnectionSelection = (connectionId: string) => {
    setSelectedConnections((prev) =>
      prev.includes(connectionId)
        ? prev.filter((id) => id !== connectionId)
        : [...prev, connectionId],
    );
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-6 w-6 text-india-saffron" />
          TAFCOP - Check Mobile Connections
        </CardTitle>
        <p className="text-gray-600">
          Telecom Analytics for Fraud Management and Consumer Protection
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This service helps you identify all mobile connections
                registered in your name and block any unauthorized connections
                to prevent fraud.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    handleInputChange("mobileNumber", e.target.value)
                  }
                  placeholder="+91XXXXXXXXXX"
                  className={errors.mobileNumber ? "border-red-500" : ""}
                />
                {errors.mobileNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>

              <div>
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${errors.dateOfBirth ? "border-red-500" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth
                        ? format(formData.dateOfBirth, "PPP")
                        : "Select date of birth"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, dateOfBirth: date }))
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleSendOTP}
              disabled={isSubmitting}
              className="w-full bg-india-saffron hover:bg-saffron-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP for Verification"
              )}
            </Button>
          </>
        )}

        {currentStep === 2 && otpSent && (
          <>
            <div className="text-center space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  value={formData.otp}
                  onChange={(e) =>
                    handleInputChange(
                      "otp",
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  placeholder="6-digit OTP"
                  className={`text-center text-lg tracking-widest ${errors.otp ? "border-red-500" : ""}`}
                  maxLength={6}
                />
                {errors.otp && (
                  <p className="text-sm text-red-600 mt-1">{errors.otp}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  OTP sent to {formData.mobileNumber}
                </p>
              </div>
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={isSubmitting}
              className="w-full bg-india-saffron hover:bg-saffron-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying & Fetching Connections...
                </>
              ) : (
                "Verify OTP & Check Connections"
              )}
            </Button>
          </>
        )}

        {currentStep === 3 && connections.length > 0 && (
          <>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Mobile Connections in Your Name
              </h3>

              <div className="grid gap-4">
                {connections.map((connection) => (
                  <Card
                    key={connection.id}
                    className={`p-4 ${!connection.isAuthorized ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">
                            {connection.number}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              connection.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {connection.status.toUpperCase()}
                          </span>
                          {!connection.isAuthorized && (
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              UNAUTHORIZED
                            </span>
                          )}
                          {connection.isAuthorized && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            Operator: {connection.operator} | Circle:{" "}
                            {connection.circle}
                          </p>
                          <p>
                            Activation Date:{" "}
                            {format(new Date(connection.activationDate), "PPP")}
                          </p>
                        </div>
                      </div>

                      {!connection.isAuthorized &&
                        connection.status === "active" && (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedConnections.includes(
                                connection.id,
                              )}
                              onChange={() =>
                                toggleConnectionSelection(connection.id)
                              }
                              className="h-4 w-4 text-india-saffron"
                            />
                            <span className="text-sm">Select to block</span>
                          </div>
                        )}
                    </div>
                  </Card>
                ))}
              </div>

              {selectedConnections.length > 0 && (
                <div className="flex gap-4">
                  <Button
                    onClick={handleBlockConnections}
                    disabled={isSubmitting}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Blocking Connections...
                      </>
                    ) : (
                      `Block Selected (${selectedConnections.length})`
                    )}
                  </Button>
                </div>
              )}

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Blocking unauthorized connections
                  will immediately disconnect them from all telecom networks.
                  This action cannot be undone easily.
                </AlertDescription>
              </Alert>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TAFCOPService;
