import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavigationButtons from "@/components/common/NavigationButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  ChevronUp,
  Download,
  Printer,
  Search,
  Share2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Guidelines = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Current date for last updated
  const currentDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handle scroll events for back to top button and active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Find active section based on scroll position
      const sections = document.querySelectorAll("[data-section]");
      let current = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = section.getAttribute("data-section") || "";
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tableOfContents = [
    { id: "terms-conditions", title: "Terms and Conditions", icon: "📋" },
    { id: "privacy-policy", title: "Privacy Policy", icon: "🔒" },
    { id: "reporting-guidelines", title: "Reporting Guidelines", icon: "📝" },
    { id: "community-guidelines", title: "Community Guidelines", icon: "👥" },
    { id: "data-protection", title: "Data Protection Policy", icon: "🛡️" },
    { id: "acceptable-use", title: "Acceptable Use Policy", icon: "✅" },
    { id: "disclaimer", title: "Disclaimer", icon: "⚠️" },
    { id: "contact-information", title: "Contact Information", icon: "📞" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    alert("PDF download functionality would be implemented here");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Chakshu Portal - Guidelines & Policies",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-india-saffron to-saffron-600 text-white py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <span className="opacity-80">Home</span>
            <span className="mx-2">&gt;</span>
            <span>Guidelines</span>
          </nav>

          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl">📜</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Chakshu Portal - Guidelines & Policies
                </h1>
                <div className="flex items-center text-lg opacity-90">
                  <Calendar className="w-5 h-5 mr-2" />
                  Last Updated: {currentDate}
                </div>
              </div>
            </div>

            <p className="text-xl mb-8 opacity-90">
              Comprehensive policies, guidelines, and terms and conditions
              governing the use of the Enhanced Chakshu Portal - Government of
              India's initiative to combat fraudulent communications.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                className="bg-white text-india-saffron hover:bg-gray-100"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Page
              </Button>
              <Button
                variant="outline"
                className="bg-white text-india-saffron hover:bg-gray-100"
                onClick={handleDownloadPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="bg-white text-india-saffron hover:bg-gray-100"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <NavigationButtons />

        <div className="grid lg:grid-cols-4 gap-8 mt-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  Table of Contents
                </h3>

                {/* Search within page */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search guidelines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center ${
                        activeSection === item.id
                          ? "bg-india-saffron text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white"
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.title}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-12">
              {/* Official Header */}
              <Card className="border-l-4 border-india-saffron">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src="/placeholder.svg"
                      alt="Government of India"
                      className="w-12 h-12 mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Government of India
                      </h2>
                      <p className="text-gray-600 dark:text-white">
                        Ministry of Communications
                      </p>
                      <p className="text-gray-600 dark:text-white">
                        Department of Telecommunications
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-700 border-green-700"
                  >
                    Official Government Portal
                  </Badge>
                </CardContent>
              </Card>

              {/* Section 1: Terms and Conditions */}
              <section id="terms-conditions" data-section="terms-conditions">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-3 text-2xl">📋</span>
                      Terms and Conditions
                    </h2>

                    <div className="space-y-6 text-gray-700 dark:text-white">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          1.1 ACCEPTANCE OF TERMS
                        </h3>
                        <p className="leading-relaxed">
                          By accessing and using the Chakshu Portal, you agree
                          to be bound by these Terms and Conditions. If you do
                          not agree to these terms, please do not use this
                          service.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          1.2 DESCRIPTION OF SERVICE
                        </h3>
                        <p className="leading-relaxed">
                          Chakshu Portal is a Government of India initiative to
                          combat fraudulent communications including calls, SMS,
                          emails, and other digital communications.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          1.3 USER RESPONSIBILITIES
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            Provide accurate and truthful information in all
                            reports
                          </li>
                          <li>
                            Use the service only for legitimate fraud reporting
                            purposes
                          </li>
                          <li>Respect the privacy and rights of others</li>
                          <li>
                            Comply with all applicable laws and regulations
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          1.4 PROHIBITED ACTIVITIES
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Filing false or malicious reports</li>
                          <li>Attempting to hack or compromise the system</li>
                          <li>Using the service for commercial purposes</li>
                          <li>Harassment of other users or authorities</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          1.5 ACCOUNT TERMINATION
                        </h3>
                        <p className="leading-relaxed">
                          The Government reserves the right to terminate
                          accounts for violation of these terms.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          1.6 LIMITATION OF LIABILITY
                        </h3>
                        <p className="leading-relaxed">
                          The Government of India shall not be liable for any
                          direct, indirect, incidental, or consequential damages
                          arising from use of this service.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 2: Privacy Policy */}
              <section id="privacy-policy" data-section="privacy-policy">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-3 text-2xl">🔒</span>
                      Privacy Policy
                    </h2>

                    <div className="space-y-6 text-gray-700 dark:text-white">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          2.1 INFORMATION COLLECTION
                        </h3>
                        <p className="leading-relaxed mb-3">
                          We collect information you provide when:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            Creating an account (name, email, phone number)
                          </li>
                          <li>
                            Filing fraud reports (incident details, evidence)
                          </li>
                          <li>Using interactive features (comments, votes)</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          2.2 USE OF INFORMATION
                        </h3>
                        <p className="leading-relaxed mb-3">
                          Your information is used to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Process and investigate fraud reports</li>
                          <li>Communicate updates on your reports</li>
                          <li>Improve service quality and fraud prevention</li>
                          <li>Generate anonymized statistics</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          2.3 DATA SHARING
                        </h3>
                        <p className="leading-relaxed mb-3">
                          Information may be shared with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Law enforcement agencies for investigation</li>
                          <li>
                            Telecom service providers for blocking fraudulent
                            numbers
                          </li>
                          <li>Government agencies for policy formulation</li>
                          <li>Third parties only with your explicit consent</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          2.4 DATA SECURITY
                        </h3>
                        <p className="leading-relaxed">
                          We implement appropriate security measures to protect
                          your personal information including encryption, secure
                          servers, and access controls.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          2.5 YOUR RIGHTS
                        </h3>
                        <p className="leading-relaxed mb-3">
                          You have the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Access your personal data</li>
                          <li>Correct inaccurate information</li>
                          <li>Request deletion of your data</li>
                          <li>Withdraw consent for data processing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 3: Reporting Guidelines */}
              <section
                id="reporting-guidelines"
                data-section="reporting-guidelines"
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-3 text-2xl">📝</span>
                      Reporting Guidelines
                    </h2>

                    <div className="space-y-6 text-gray-700 dark:text-white">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          3.1 WHAT TO REPORT
                        </h3>
                        <p className="leading-relaxed mb-3">
                          Report fraudulent communications including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Fake KYC update calls/SMS</li>
                          <li>Lottery/prize scam messages</li>
                          <li>Job offer frauds</li>
                          <li>Banking/financial scams</li>
                          <li>Government impersonation</li>
                          <li>UPI/payment frauds</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          3.2 HOW TO REPORT
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Provide complete and accurate details</li>
                          <li>
                            Include evidence (screenshots, recordings) where
                            available
                          </li>
                          <li>Report as soon as possible after the incident</li>
                          <li>Use appropriate fraud categories</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          3.3 INFORMATION REQUIRED
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Date and time of incident</li>
                          <li>Phone number/email of fraudster</li>
                          <li>Nature of fraud attempted</li>
                          <li>Any financial loss incurred</li>
                          <li>Supporting evidence</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          3.4 FOLLOW-UP PROCESS
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>You will receive a unique report ID</li>
                          <li>
                            Updates will be provided on investigation progress
                          </li>
                          <li>Additional information may be requested</li>
                          <li>Final resolution will be communicated</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          3.5 ANONYMOUS REPORTING
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>You may report anonymously</li>
                          <li>However, follow-up may be limited</li>
                          <li>
                            Consider providing contact details for better
                            resolution
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 4: Community Guidelines */}
              <section
                id="community-guidelines"
                data-section="community-guidelines"
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-3 text-2xl">👥</span>
                      Community Guidelines
                    </h2>

                    <div className="space-y-6 text-gray-700 dark:text-white">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          4.1 RESPECTFUL COMMUNICATION
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Use respectful language in all interactions</li>
                          <li>
                            No harassment, hate speech, or discriminatory
                            content
                          </li>
                          <li>Respect privacy of other users</li>
                          <li>Be constructive in discussions</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          4.2 CONTENT STANDARDS
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Share only relevant fraud-related information</li>
                          <li>Do not post personal information of others</li>
                          <li>Verify information before sharing</li>
                          <li>Report inappropriate content</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          4.3 COMMUNITY PARTICIPATION
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Vote responsibly on community content</li>
                          <li>Provide helpful feedback on reports</li>
                          <li>Share fraud awareness information</li>
                          <li>Support other users appropriately</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          4.4 PROHIBITED BEHAVIOR
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Spamming or flooding discussions</li>
                          <li>Promoting commercial interests</li>
                          <li>Sharing false information</li>
                          <li>Attempting to identify anonymous reporters</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 5: Data Protection Policy */}
              <section id="data-protection" data-section="data-protection">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-3 text-2xl">🛡️</span>
                      Data Protection Policy
                    </h2>

                    <div className="space-y-6 text-gray-700 dark:text-white">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          5.1 DATA CLASSIFICATION
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            Personal Data: Name, contact information,
                            demographics
                          </li>
                          <li>
                            Sensitive Data: Financial information, legal
                            proceedings
                          </li>
                          <li>
                            Public Data: Anonymized fraud statistics and trends
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          5.2 DATA RETENTION
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            Active reports: Retained until resolution + 7 years
                          </li>
                          <li>
                            User accounts: Retained while account is active
                          </li>
                          <li>
                            Analytics data: Anonymized and retained indefinitely
                          </li>
                          <li>Deleted data: Securely purged within 30 days</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          5.3 CROSS-BORDER TRANSFERS
                        </h3>
                        <p className="leading-relaxed mb-3">
                          Data may be transferred to other jurisdictions for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>International fraud investigation cooperation</li>
                          <li>Technical support and maintenance</li>
                          <li>Government-to-government information sharing</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          5.4 BREACH NOTIFICATION
                        </h3>
                        <p className="leading-relaxed mb-3">
                          In case of data breach:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Authorities notified within 72 hours</li>
                          <li>Affected users informed within 7 days</li>
                          <li>Remedial measures implemented immediately</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 6: Acceptable Use Policy */}
              <section id="acceptable-use" data-section="acceptable-use">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-3 text-2xl">✅</span>
                      Acceptable Use Policy
                    </h2>

                    <div className="space-y-6 text-gray-700 dark:text-white">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          6.1 PERMITTED USES
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Reporting genuine fraud incidents</li>
                          <li>Accessing community resources</li>
                          <li>Using educational materials</li>
                          <li>Participating in awareness programs</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          6.2 PROHIBITED USES
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Automated or bulk reporting</li>
                          <li>Attempting system vulnerabilities</li>
                          <li>Reverse engineering the platform</li>
                          <li>Commercial use without permission</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          6.3 CONTENT RESTRICTIONS
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>No copyrighted material without permission</li>
                          <li>No malicious code or links</li>
                          <li>No personal attacks or defamation</li>
                          <li>No content promoting illegal activities</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          6.4 ENFORCEMENT
                        </h3>
                        <p className="leading-relaxed mb-3">
                          Violations may result in:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Content removal</li>
                          <li>Account suspension</li>
                          <li>Permanent ban</li>
                          <li>Legal action if warranted</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 7: Disclaimer */}
              <section id="disclaimer" data-section="disclaimer">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-3 text-2xl">⚠️</span>
                      Disclaimer
                    </h2>

                    <div className="space-y-6 text-gray-700 dark:text-white">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          7.1 SERVICE AVAILABILITY
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Service provided "as is" without warranties</li>
                          <li>No guarantee of uninterrupted service</li>
                          <li>
                            Maintenance may cause temporary unavailability
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          7.2 ACCURACY OF INFORMATION
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Information provided for general guidance</li>
                          <li>Users should verify information independently</li>
                          <li>
                            Government not liable for decisions based on portal
                            information
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          7.3 THIRD-PARTY LINKS
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Links to external sites for convenience only</li>
                          <li>
                            Government not responsible for third-party content
                          </li>
                          <li>Users access external links at own risk</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          7.4 INVESTIGATION OUTCOMES
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            No guarantee of specific investigation outcomes
                          </li>
                          <li>
                            Resolution depends on available evidence and
                            cooperation
                          </li>
                          <li>Some cases may not result in prosecution</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Section 8: Contact Information */}
              <section
                id="contact-information"
                data-section="contact-information"
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-3 text-2xl">📞</span>
                      Contact Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            General Inquiries
                          </h3>
                          <div className="space-y-2 text-gray-700 dark:text-white">
                            <p>
                              <strong>Email:</strong> support@chakshu.gov.in
                            </p>
                            <p>
                              <strong>Phone:</strong> 1930 (Toll-free)
                            </p>
                            <p>
                              <strong>Hours:</strong> Monday to Friday, 9:00 AM
                              to 6:00 PM (IST)
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Technical Support
                          </h3>
                          <div className="space-y-2 text-gray-700 dark:text-white">
                            <p>
                              <strong>Email:</strong>{" "}
                              tech-support@chakshu.gov.in
                            </p>
                            <p>
                              <strong>Available:</strong> 24/7 for critical
                              issues
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Emergency Fraud Reporting
                          </h3>
                          <div className="space-y-2 text-gray-700 dark:text-white">
                            <p>
                              <strong>Available:</strong> 24/7
                            </p>
                            <p>
                              <strong>
                                For urgent cases requiring immediate attention
                              </strong>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Legal Concerns
                          </h3>
                          <div className="space-y-2 text-gray-700 dark:text-white">
                            <p>
                              <strong>Email:</strong> legal@chakshu.gov.in
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Postal Address
                          </h3>
                          <div className="space-y-2 text-gray-700 dark:text-white">
                            <p>Department of Telecommunications</p>
                            <p>Ministry of Communications</p>
                            <p>Government of India</p>
                            <p>New Delhi - 110001</p>
                          </div>
                        </div>

                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Quick Links
                          </h3>
                          <div className="space-y-2">
                            <a
                              href="https://dot.gov.in"
                              className="flex items-center text-india-saffron hover:underline"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Department of Telecommunications
                            </a>
                            <a
                              href="https://www.trai.gov.in"
                              className="flex items-center text-india-saffron hover:underline"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              TRAI Official Website
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Footer Note */}
              <Card className="border-t-4 border-india-saffron">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    These guidelines are subject to periodic updates. Users will
                    be notified of significant changes.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    © 2025 Government of India. All rights reserved. | Chakshu
                    Portal - Enhanced Spam Reporting System
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 bg-india-saffron hover:bg-saffron-600 text-white shadow-lg"
          size="sm"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      )}

      <Footer />
    </div>
  );
};

export default Guidelines;
