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
  CheckCircle,
  AlertTriangle,
  X,
  Smartphone,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface DeviceInfo {
  imei: string;
  brand: string;
  model: string;
  isGenuine: boolean;
  isBlacklisted: boolean;
  importStatus: "legal" | "illegal" | "unknown";
  manufacturingDate: string;
  tac: string;
}

const KYMService: React.FC = () => {
  const [formData, setFormData] = useState({
    imeiNumber: "",
    mobileNumber: "+91",
    purchaseDate: undefined as Date | undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock device information
  const mockDeviceInfo: DeviceInfo = {
    imei: "123456789012345",
    brand: "Samsung",
    model: "Galaxy S21",
    isGenuine: true,
    isBlacklisted: false,
    importStatus: "legal",
    manufacturingDate: "2023-03-15",
    tac: "12345678",
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.imeiNumber) {
      newErrors.imeiNumber = "IMEI number is required";
    } else if (!/^\d{15}$/.test(formData.imeiNumber)) {
      newErrors.imeiNumber = "IMEI must be exactly 15 digits";
    }

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyDevice = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Simulate device verification with mock data
      const isGenuine = Math.random() > 0.3; // 70% chance of being genuine
      const isBlacklisted = Math.random() > 0.8; // 20% chance of being blacklisted

      setDeviceInfo({
        ...mockDeviceInfo,
        imei: formData.imeiNumber,
        isGenuine,
        isBlacklisted,
      });
      setIsSubmitting(false);

      toast({
        title: "Device Verification Complete",
        description: `Device status: ${isGenuine ? "Genuine" : "Suspicious"}`,
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "genuine":
      case "legal":
        return "text-green-600 bg-green-50";
      case "suspicious":
      case "illegal":
        return "text-red-600 bg-red-50";
      default:
        return "text-yellow-600 bg-yellow-50";
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-india-saffron" />
          KYM - Know Your Mobile
        </CardTitle>
        <p className="text-gray-600">
          Verify the genuineness and legal status of your mobile handset
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {!deviceInfo && (
          <>
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                This service helps you verify if your mobile device is genuine,
                legally imported, and not stolen or counterfeit. Enter your
                device IMEI number to check.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="imeiNumber">IMEI Number (15 digits)</Label>
                <Input
                  id="imeiNumber"
                  value={formData.imeiNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "imeiNumber",
                      e.target.value.replace(/\D/g, "").slice(0, 15),
                    )
                  }
                  placeholder="123456789012345"
                  className={errors.imeiNumber ? "border-red-500" : ""}
                />
                {errors.imeiNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.imeiNumber}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Dial *#06# on your phone to find the IMEI number
                </p>
              </div>

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
                <Label>Device Purchase Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.purchaseDate
                        ? format(formData.purchaseDate, "PPP")
                        : "Select purchase date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.purchaseDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, purchaseDate: date }))
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("2000-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button
              onClick={handleVerifyDevice}
              disabled={isSubmitting}
              className="w-full bg-india-saffron hover:bg-saffron-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Device...
                </>
              ) : (
                "Verify Device Genuineness"
              )}
            </Button>
          </>
        )}

        {deviceInfo && (
          <div className="space-y-6">
            <div className="text-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold ${
                  deviceInfo.isGenuine
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {deviceInfo.isGenuine ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <X className="h-6 w-6" />
                )}
                {deviceInfo.isGenuine
                  ? "Device is Genuine"
                  : "Device is Suspicious"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Device Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>IMEI:</span>
                    <span className="font-mono">{deviceInfo.imei}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brand:</span>
                    <span>{deviceInfo.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span>{deviceInfo.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TAC:</span>
                    <span className="font-mono">{deviceInfo.tac}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2">Verification Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Genuineness:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(deviceInfo.isGenuine ? "genuine" : "suspicious")}`}
                    >
                      {deviceInfo.isGenuine ? "Genuine" : "Suspicious"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Blacklist Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(deviceInfo.isBlacklisted ? "suspicious" : "genuine")}`}
                    >
                      {deviceInfo.isBlacklisted ? "Blacklisted" : "Clean"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Import Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(deviceInfo.importStatus)}`}
                    >
                      {deviceInfo.importStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {deviceInfo.isBlacklisted && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> This device is blacklisted. It may
                  be stolen or involved in fraudulent activities. Contact your
                  telecom operator or visit a police station for further
                  assistance.
                </AlertDescription>
              </Alert>
            )}

            {!deviceInfo.isGenuine && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Caution:</strong> This device appears to be
                  suspicious. It may be counterfeit or illegally imported.
                  Consider verifying with an authorized dealer.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setDeviceInfo(null);
                  setFormData({
                    imeiNumber: "",
                    mobileNumber: "+91",
                    purchaseDate: undefined,
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Check Another Device
              </Button>
              <Button
                onClick={() => window.print()}
                className="flex-1 bg-india-saffron hover:bg-saffron-600"
              >
                Print Report
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KYMService;
