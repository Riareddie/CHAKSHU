import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new reports management page
    navigate("/reports-management", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Redirecting...
        </h2>
        <p className="text-gray-600">
          Taking you to the reports management page.
        </p>
      </div>
    </div>
  );
};

export default Reports;
