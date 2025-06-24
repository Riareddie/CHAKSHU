import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wifi,
  Loader2,
  CheckCircle,
  Building,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ISPInfo {
  connectionId: string;
  ispName: string;
  planName: string;
  planSpeed: string;
  monthlyCharges: number;
  installationDate: string;
  connectionStatus: "active" | "inactive" | "suspended";
  customerName: string;
  registeredAddress: string;
  contactNumber: string;
  customerCareNumber: string;
  nodeName: string;
  exchangeName: string;
}

const WirelineISPService: React.FC = () => {
  const [formData, setFormData] = useState({
    connectionNumber: "",
    registeredAddress: "",
    pinCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ispInfo, setIspInfo] = useState<ISPInfo | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock ISP information
  const mockISPData: ISPInfo = {
    connectionId: "DEL123456789",
    ispName: "BSNL Broadband",
    planName: "Fiber Basic Plus",
    planSpeed: "100 Mbps",
    monthlyCharges: 849,
    installationDate: "2023-03-15",
    connectionStatus: "active",
    customerName: "John Doe",
    registeredAddress: "123, ABC Colony, New Delhi - 110001",
    contactNumber: "+91-9876543210",
    customerCareNumber: "1800-180-1503",
    nodeName: "ND_CENTRAL_01",
    exchangeName: "New Delhi Central Exchange",
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.connectionNumber.trim()) {
      newErrors.connectionNumber = "Connection number/Account ID is required";
    }

    if (!formData.registeredAddress.trim()) {
      newErrors.registeredAddress = "Registered address is required";
    } else if (formData.registeredAddress.trim().length < 10) {
      newErrors.registeredAddress = "Please provide a complete address";
    }

    if (!formData.pinCode) {
      newErrors.pinCode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "PIN code must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyISP = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Simulate ISP verification with mock data
      const connectionExists = Math.random() > 0.2; // 80% chance of finding connection

      if (connectionExists) {
        setIspInfo({
          ...mockISPData,
          connectionId: formData.connectionNumber,
        });
        toast({
          title: "Connection Found",
          description: "ISP details retrieved successfully",
        });
      } else {
        toast({
          title: "Connection Not Found",
          description: "No wireline connection found with the provided details",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "inactive":
        return "text-gray-600 bg-gray-50";
      case "suspended":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-6 w-6 text-india-saffron" />
          Know Your Wireline ISP
        </CardTitle>
        <p className="text-gray-600">
          Verify your wireline internet service provider details and connection
          information
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {!ispInfo && (
          <>
            <Alert>
              <Wifi className="h-4 w-4" />
              <AlertDescription>
                This service helps you verify your wireline broadband connection
                details including your ISP, plan information, and contact
                details for customer support.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="connectionNumber">
                  Connection Number / Account ID
                </Label>
                <Input
                  id="connectionNumber"
                  value={formData.connectionNumber}
                  onChange={(e) =>
                    handleInputChange("connectionNumber", e.target.value)
                  }
                  placeholder="e.g., DEL123456789, ACT12345, JIO789012"
                  className={errors.connectionNumber ? "border-red-500" : ""}
                />
                {errors.connectionNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.connectionNumber}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Your connection number is usually found on your monthly bill
                </p>
              </div>

              <div>
                <Label htmlFor="registeredAddress">Registered Address</Label>
                <Input
                  id="registeredAddress"
                  value={formData.registeredAddress}
                  onChange={(e) =>
                    handleInputChange("registeredAddress", e.target.value)
                  }
                  placeholder="Complete address as per connection records"
                  className={errors.registeredAddress ? "border-red-500" : ""}
                />
                {errors.registeredAddress && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.registeredAddress}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="pinCode">PIN Code</Label>
                <Input
                  id="pinCode"
                  value={formData.pinCode}
                  onChange={(e) =>
                    handleInputChange(
                      "pinCode",
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  placeholder="6-digit PIN code"
                  className={errors.pinCode ? "border-red-500" : ""}
                />
                {errors.pinCode && (
                  <p className="text-sm text-red-600 mt-1">{errors.pinCode}</p>
                )}
              </div>
            </div>

            <Button
              onClick={handleVerifyISP}
              disabled={isSubmitting}
              className="w-full bg-india-saffron hover:bg-saffron-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Connection...
                </>
              ) : (
                "Verify ISP Details"
              )}
            </Button>
          </>
        )}

        {ispInfo && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold bg-green-100 text-green-800">
                <CheckCircle className="h-6 w-6" />
                Connection Verified
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ISP Information */}
              <Card className="p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-india-saffron" />
                  ISP Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ISP Name:</span>
                    <span className="font-medium">{ispInfo.ispName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Connection ID:</span>
                    <span className="font-mono text-sm">
                      {ispInfo.connectionId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Node Name:</span>
                    <span>{ispInfo.nodeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exchange:</span>
                    <span>{ispInfo.exchangeName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ispInfo.connectionStatus)}`}
                    >
                      {ispInfo.connectionStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Plan Details */}
              <Card className="p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-india-saffron" />
                  Plan Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Name:</span>
                    <span className="font-medium">{ispInfo.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speed:</span>
                    <span className="font-medium text-blue-600">
                      {ispInfo.planSpeed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Charges:</span>
                    <span className="font-medium">
                      ₹{ispInfo.monthlyCharges}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Installation Date:</span>
                    <span>
                      {new Date(ispInfo.installationDate).toLocaleDateString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Customer Information */}
              <Card className="p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-india-saffron" />
                  Customer Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600 block">Customer Name:</span>
                    <span className="font-medium">{ispInfo.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">
                      Registered Address:
                    </span>
                    <span>{ispInfo.registeredAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-mono text-sm">
                      {ispInfo.contactNumber}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Support Information */}
              <Card className="p-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-india-saffron" />
                  Customer Support
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600 block">Customer Care:</span>
                    <span className="font-mono text-lg text-blue-600">
                      {ispInfo.customerCareNumber}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>• Available 24/7 for technical support</p>
                    <p>• Billing and payment assistance</p>
                    <p>• Service upgrade and modification</p>
                  </div>
                </div>
              </Card>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Verified Connection:</strong> This wireline connection
                is registered and active. Keep your connection details secure
                and contact customer care for any service issues.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setIspInfo(null);
                  setFormData({
                    connectionNumber: "",
                    registeredAddress: "",
                    pinCode: "",
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Check Another Connection
              </Button>
              <Button
                onClick={() => window.print()}
                className="flex-1 bg-india-saffron hover:bg-saffron-600"
              >
                Print Details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WirelineISPService;
