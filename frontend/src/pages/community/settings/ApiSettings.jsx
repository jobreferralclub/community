// =========================================================
// ApiSettings.jsx
// Full-featured API Settings Screen
// - API Keys (list + generate + revoke)
// - API Documentation quick links
// Dark Mode UI with TailwindCSS + Framer Motion
// =========================================================

import React from "react";
import { motion } from "framer-motion";

const ApiSettings = () => {
  const apiKeys = [
    {
      name: "Production API Key",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
    },
    {
      name: "Development API Key",
      created: "2024-01-10",
      lastUsed: "1 day ago",
    },
  ];

  const docs = [
    "Authentication & Authorization",
    "User Management",
    "Community Posts",
    "Job Referrals",
    "Analytics Data",
    "Webhooks",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* API Keys Section */}
      <div className="bg-zinc-900 rounded-xl p-6 shadow-md border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>
        <p className="text-gray-400 mb-6">
          Generate API keys to integrate with third-party applications.
        </p>

        <div className="space-y-4">
          {apiKeys.map((key, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-700 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-white">{key.name}</h4>
                <p className="text-sm text-gray-400">
                  Created: {key.created} • Last used: {key.lastUsed}
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="text-primary-500 hover:text-primary-600 transition-colors">
                  View
                </button>
                <button className="text-red-600 hover:text-red-700 transition-colors">
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-6 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          Generate New Key
        </button>
      </div>

      {/* API Documentation Section */}
      <div className="bg-zinc-900 rounded-xl p-6 shadow-md border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">API Documentation</h3>
        <p className="text-gray-400 mb-4">
          Learn how to integrate with our API endpoints.
        </p>
        <div className="space-y-3">
          {docs.map((topic, idx) => (
            <a
              key={idx}
              href="#"
              className="block p-3 border border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-900 transition-colors"
            >
              {topic}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ApiSettings;
