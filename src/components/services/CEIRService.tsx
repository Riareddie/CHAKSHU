import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const CEIRService: React.FC = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "+91",
    imeiNumber: "",
    deviceBrand: "",
    deviceModel: "",
    lossDate: undefined as Date | undefined,
    policeComplaint: "",
    otp: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const deviceBrands = [
    "Samsung",
    "Apple",
    "Xiaomi",
    "OnePlus",
    "Vivo",
    "Oppo",
    "Realme",
    "Nokia",
    "Motorola",
    "LG",
    "Sony",
    "Other",
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

    if (!formData.imeiNumber) {
      newErrors.imeiNumber = "IMEI number is required";
    } else if (!/^\d{15}$/.test(formData.imeiNumber)) {
      newErrors.imeiNumber = "IMEI must be exactly 15 digits";
    }

    if (!formData.deviceBrand) {
      newErrors.deviceBrand = "Device brand is required";
    }

    if (!formData.deviceModel.trim()) {
      newErrors.deviceModel = "Device model is required";
    }

    if (!formData.lossDate) {
      newErrors.lossDate = "Loss/theft date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validateStep1()) return;

    setIsSubmitting(true);

    // Simulate OTP sending
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

    // Simulate OTP verification and device blocking
    setTimeout(() => {
      setIsBlocked(true);
      setCurrentStep(3);
      setIsSubmitting(false);
      toast({
        title: "Device Blocked Successfully",
        description: "Your device has been blocked in the CEIR database",
      });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (currentStep === 3 && isBlocked) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Device Blocked Successfully
          </h2>
          <p className="text-gray-600 mb-6">
            Your device with IMEI {formData.imeiNumber} has been successfully
            blocked in the CEIR database.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-green-700 text-left space-y-1">
              <li>• Your device cannot be used on any network in India</li>
              <li>• The device will show "No Service" even with a valid SIM</li>
              <li>• You can unblock the device if you recover it</li>
              <li>• This helps prevent misuse of your stolen device</li>
            </ul>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-india-saffron hover:bg-saffron-600"
          >
            Block Another Device
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-india-saffron" />
          CEIR Device Blocking Service
        </CardTitle>
        <p className="text-gray-600">
          Block your lost or stolen mobile device to prevent misuse
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <>
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
                  Dial *#06# to find your IMEI number
                </p>
              </div>

              <div>
                <Label htmlFor="deviceBrand">Device Brand</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("deviceBrand", value)
                  }
                >
                  <SelectTrigger
                    className={errors.deviceBrand ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select device brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.deviceBrand && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.deviceBrand}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="deviceModel">Device Model</Label>
                <Input
                  id="deviceModel"
                  value={formData.deviceModel}
                  onChange={(e) =>
                    handleInputChange("deviceModel", e.target.value)
                  }
                  placeholder="e.g., Galaxy S21, iPhone 13"
                  className={errors.deviceModel ? "border-red-500" : ""}
                />
                {errors.deviceModel && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.deviceModel}
                  </p>
                )}
              </div>

              <div>
                <Label>Loss/Theft Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${errors.lossDate ? "border-red-500" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.lossDate
                        ? format(formData.lossDate, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.lossDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, lossDate: date }))
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.lossDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.lossDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="policeComplaint">
                  Police Complaint Number (Optional)
                </Label>
                <Input
                  id="policeComplaint"
                  value={formData.policeComplaint}
                  onChange={(e) =>
                    handleInputChange("policeComplaint", e.target.value)
                  }
                  placeholder="FIR Number if available"
                />
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
                  Verifying & Blocking Device...
                </>
              ) : (
                "Verify OTP & Block Device"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleSendOTP}
              className="w-full"
            >
              Resend OTP
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CEIRService;
