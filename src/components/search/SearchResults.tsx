import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  Eye,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import SearchResultModal from "./SearchResultModal";

interface SearchState {
  query: string;
  filters: {
    dateRange: { from: Date | null; to: Date | null };
    fraudTypes: string[];
    location: string;
    severity: number[];
    status: string[];
  };
  sortBy: "date" | "relevance" | "severity";
  sortOrder: "asc" | "desc";
}

interface SearchResultsProps {
  searchState: SearchState;
  onQueryChange: (query: string) => void;
}

// Mock data for demonstration
const mockResults = [
  {
    id: "1",
    type: "report" as const,
    title: "Phishing Email Targeting Bank Customers",
    description:
      "Received suspicious email claiming to be from SBI asking for KYC verification with urgent deadline. The email looked very authentic with bank logos and formatting.",
    fraudType: "Phishing Email",
    severity: 8,
    status: "Under Review",
    location: "Maharashtra",
    date: new Date("2024-01-15"),
    reportedBy: "Anonymous User",
    comments: 3,
    details: {
      phoneNumber: "+91-9876543210",
      email: "fake@sbi.co.in",
      amountLost: 0,
      actionsTaken: [
        "Reported to bank immediately",
        "Changed all banking passwords",
        "Enabled SMS alerts for all transactions",
      ],
      tags: ["phishing", "email", "sbi", "kyc"],
    },
  },
  {
    id: "2",
    type: "alert" as const,
    title: "New SMS Scam Pattern Detected",
    description:
      "Fraudsters using fake lottery messages with links to malicious websites for data harvesting. Multiple reports received across different states.",
    fraudType: "SMS Scam",
    severity: 6,
    status: "Resolved",
    location: "Karnataka",
    date: new Date("2024-01-14"),
    reportedBy: "Community Moderator",
    comments: 3,
    details: {
      phoneNumber: "+91-7654321098",
      website: "fake-lottery-site.com",
      actionsTaken: [
        "Website blocked by authorities",
        "Phone number reported to telecom providers",
        "Public awareness campaign launched",
      ],
      tags: ["sms", "lottery", "scam", "data-theft"],
    },
  },
  {
    id: "3",
    type: "discussion" as const,
    title: "How to Identify Fake Investment Schemes?",
    description:
      "Discussion about red flags in investment opportunities and sharing experiences with fraudulent schemes. Community members sharing their experiences and tips.",
    fraudType: "Investment Fraud",
    severity: 7,
    status: "Active",
    location: "Delhi",
    date: new Date("2024-01-13"),
    reportedBy: "FraudFighter2024",
    comments: 3,
    details: {
      tags: ["investment", "ponzi", "education", "prevention"],
    },
  },
  {
    id: "4",
    type: "report" as const,
    title: "Fake Tech Support Call from Microsoft",
    description:
      "Received call claiming computer was infected, asking for remote access and payment for fake software. Caller had Indian accent but claimed to be from Microsoft USA.",
    fraudType: "Tech Support Scam",
    severity: 5,
    status: "Blocked",
    location: "Tamil Nadu",
    date: new Date("2024-01-12"),
    reportedBy: "VijayK",
    comments: 3,
    details: {
      phoneNumber: "+1-800-FAKE-NUM",
      amountLost: 5000,
      actionsTaken: [
        "Hung up immediately",
        "Ran antivirus scan",
        "Reported to cybercrime portal",
      ],
      tags: ["tech-support", "microsoft", "remote-access", "fake-call"],
    },
  },
];

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 px-1 rounded">$1</mark>',
  );
};

const getSeverityColor = (severity: number) => {
  if (severity >= 8) return "bg-red-100 text-red-800";
  if (severity >= 6) return "bg-orange-100 text-orange-800";
  if (severity >= 4) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800";
    case "Blocked":
      return "bg-red-100 text-red-800";
    case "Under Review":
      return "bg-blue-100 text-blue-800";
    case "Active":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "report":
      return <AlertTriangle className="h-4 w-4" />;
    case "discussion":
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({ searchState }) => {
  const [selectedResult, setSelectedResult] = useState<
    (typeof mockResults)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResultClick = (result: (typeof mockResults)[0]) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
  };
  // Filter and sort results based on search state
  let filteredResults = mockResults.filter((result) => {
    // Text search
    if (searchState.query.trim()) {
      const query = searchState.query.toLowerCase();
      const matchesText =
        result.title.toLowerCase().includes(query) ||
        result.description.toLowerCase().includes(query) ||
        result.fraudType.toLowerCase().includes(query);
      if (!matchesText) return false;
    }

    // Fraud type filter
    if (searchState.filters.fraudTypes.length > 0) {
      if (!searchState.filters.fraudTypes.includes(result.fraudType))
        return false;
    }

    // Location filter
    if (searchState.filters.location) {
      if (result.location !== searchState.filters.location) return false;
    }

    // Status filter
    if (searchState.filters.status.length > 0) {
      if (!searchState.filters.status.includes(result.status)) return false;
    }

    // Severity filter
    if (
      result.severity < searchState.filters.severity[0] ||
      result.severity > searchState.filters.severity[1]
    ) {
      return false;
    }

    // Date range filter
    if (searchState.filters.dateRange.from) {
      if (result.date < searchState.filters.dateRange.from) return false;
    }
    if (searchState.filters.dateRange.to) {
      if (result.date > searchState.filters.dateRange.to) return false;
    }

    return true;
  });

  // Sort results
  filteredResults.sort((a, b) => {
    let compareValue = 0;

    switch (searchState.sortBy) {
      case "date":
        compareValue = a.date.getTime() - b.date.getTime();
        break;
      case "severity":
        compareValue = a.severity - b.severity;
        break;
      case "relevance":
      default:
        // Simple relevance based on query matches
        const aMatches = searchState.query
          ? (a.title + a.description)
              .toLowerCase()
              .split(searchState.query.toLowerCase()).length - 1
          : 0;
        const bMatches = searchState.query
          ? (b.title + b.description)
              .toLowerCase()
              .split(searchState.query.toLowerCase()).length - 1
          : 0;
        compareValue = aMatches - bMatches;
        break;
    }

    return searchState.sortOrder === "desc" ? -compareValue : compareValue;
  });

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {filteredResults.length} results found
          {searchState.query && (
            <span>
              {" "}
              for "<strong>{searchState.query}</strong>"
            </span>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-sm">
                  Try adjusting your search criteria or removing some filters.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredResults.map((result) => (
            <Card
              key={result.id}
              className="hover:shadow-md transition-all duration-200 cursor-pointer hover:border-india-saffron/30"
              onClick={() => handleResultClick(result)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(result.type)}
                    <h3
                      className="text-lg font-semibold hover:text-india-saffron transition-colors"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(result.title, searchState.query),
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(result.severity)}>
                      Severity {result.severity}
                    </Badge>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p
                  className="text-gray-600 mb-4 text-sm leading-relaxed"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: highlightText(
                      result.description,
                      searchState.query,
                    ),
                  }}
                />

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {result.reportedBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {result.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(result.date, "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {result.comments} comments
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="text-xs"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        result.fraudType,
                        searchState.query,
                      ),
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResultClick(result);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Search Result Modal */}
      <SearchResultModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        result={selectedResult}
      />
    </div>
  );
};

export default SearchResults;
