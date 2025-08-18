// =========================================================
// DataExportSettings.jsx
// Complete settings for data export & account deletion
// Dark mode with TailwindCSS + Framer Motion
// =========================================================

import React from "react";
import { motion } from "framer-motion";

const DataExportSettings = () => {
  const exportOptions = [
    {
      name: "Profile Data",
      description: "Personal information and settings",
      format: "JSON",
    },
    {
      name: "Community Posts",
      description: "All your posts and comments",
      format: "CSV",
    },
    {
      name: "Referral History",
      description: "Job referrals made and received",
      format: "CSV",
    },
    {
      name: "Analytics Data",
      description: "Your engagement and activity metrics",
      format: "JSON",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Data Export Section */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Export Your Data
        </h3>
        <p className="text-gray-400 mb-6">
          Download a copy of your data in various formats.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportOptions.map((dataType) => (
            <div
              key={dataType.name}
              className="p-4 border border-gray-700 rounded-lg"
            >
              <h4 className="font-medium text-white mb-1">{dataType.name}</h4>
              <p className="text-sm text-gray-400 mb-3">
                {dataType.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {dataType.format}
                </span>
                <button className="text-primary-500 hover:text-primary-600 transition-colors">
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Deletion Section */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-md border border-red-700">
        <h3 className="text-lg font-semibold text-red-500 mb-4">
          Delete Account
        </h3>
        <p className="text-gray-400 mb-6">
          Permanently delete your account and all associated data.{" "}
          <span className="text-red-400 font-medium">
            This action cannot be undone.
          </span>
        </p>
        <button className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors">
          Delete Account
        </button>
      </div>
    </motion.div>
  );
};

export default DataExportSettings;
