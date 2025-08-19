import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DataExportSettings = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        console.log("User data:", data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Utility to convert JSON array to CSV string, with safety checks
  const jsonToCsv = (json) => {
    if (!Array.isArray(json) || json.length === 0) {
      return "No data available\n"; // Return fallback CSV content
    }

    const keys = Object.keys(json[0] || {});
    if (keys.length === 0) {
      return "No data available\n"; // No keys to build CSV header
    }

    const csvRows = [
      keys.join(","), // header row
      ...json.map((row) =>
        keys
          .map((key) => {
            let cell = row[key];
            if (cell === null || cell === undefined) cell = "";
            else cell = String(cell).replace(/"/g, '""');
            return `"${cell}"`;
          })
          .join(",")
      ),
    ];
    return csvRows.join("\n");
  };

  // Download CSV file helper function
  const downloadCsv = (data, filename) => {
    const csv = jsonToCsv(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export options - all CSV only
  const exportOptions = [
    {
      name: "Profile Data",
      description: "Personal information and settings",
      format: "CSV",
      dataKey: "profileData",
    },
    {
      name: "Community Posts",
      description: "All your posts and comments",
      format: "CSV",
      dataKey: "communityPosts",
    },
    {
      name: "Referral History",
      description: "Job referrals made and received",
      format: "CSV",
      dataKey: "referralHistory",
    },
    {
      name: "Analytics Data",
      description: "Your engagement and activity metrics",
      format: "CSV",
      dataKey: "analyticsData",
    },
  ];

  // Safe data extraction from userData, ensure always array format
  const getDataByKey = (key) => {
    if (!userData) return [];

    switch (key) {
      case "profileData":
        // API already returns an array of user profiles
        return Array.isArray(userData) ? userData : [userData];
      case "communityPosts":
        return Array.isArray(userData.posts) ? userData.posts : [];
      case "referralHistory":
        return Array.isArray(userData.referrals) ? userData.referrals : [];
      case "analyticsData":
        return userData.analytics ? [userData.analytics] : [];
      default:
        return [];
    }
  };

  // Export handler, always CSV
  const handleExport = (option) => {
    const data = getDataByKey(option.dataKey);
    downloadCsv(data, `${option.name.replace(/\s+/g, "_")}.csv`);
  };

  if (loading) {
    return <div className="text-white p-6">Loading user data...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Data Export Section */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Export Your Data</h3>
        <p className="text-gray-400 mb-6">Download a copy of your data in CSV format.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportOptions.map((dataType) => (
            <div key={dataType.name} className="p-4 border border-gray-700 rounded-lg">
              <h4 className="font-medium text-white mb-1">{dataType.name}</h4>
              <p className="text-sm text-gray-400 mb-3">{dataType.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {dataType.format}
                </span>
                <button
                  onClick={() => handleExport(dataType)}
                  className="text-primary-500 hover:text-primary-600 transition-colors"
                  disabled={!userData}
                >
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Deletion Section */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-md border border-red-700">
        <h3 className="text-lg font-semibold text-red-500 mb-4">Delete Account</h3>
        <p className="text-gray-400 mb-6">
          Permanently delete your account and all associated data.{" "}
          <span className="text-red-400 font-medium">This action cannot be undone.</span>
        </p>
        <button className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors">
          Delete Account
        </button>
      </div>
    </motion.div>
  );
};

export default DataExportSettings;
