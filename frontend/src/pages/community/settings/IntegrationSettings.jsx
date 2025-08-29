// =========================================================
// IntegrationSettings.jsx
// Full-featured integration settings screen
// Converted from renderIntegrations
// Uses TailwindCSS + Framer Motion
// =========================================================

import React from "react";
import { motion } from "framer-motion";

const IntegrationSettings = () => {
  const integrations = [
    {
      name: "Zapier",
      description: "Automate workflows",
      status: "connected",
      logo: "⚡",
    },
    {
      name: "Slack",
      description: "Get notifications in Slack",
      status: "disconnected",
      logo: "💬",
    },
    {
      name: "Zoom",
      description: "Schedule video calls",
      status: "connected",
      logo: "📹",
    },
    {
      name: "Google Calendar",
      description: "Sync your schedule",
      status: "connected",
      logo: "📅",
    },
    {
      name: "LinkedIn",
      description: "Import profile data",
      status: "disconnected",
      logo: "💼",
    },
    {
      name: "GitHub",
      description: "Showcase your code",
      status: "disconnected",
      logo: "🐙",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 rounded-xl p-6 shadow-md border border-gray-700"
    >
      <h3 className="text-lg font-semibold text-white mb-6">
        Connected Integrations
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="p-4 border border-gray-700 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.logo}</span>
                <div>
                  <h4 className="font-medium text-white">{integration.name}</h4>
                  <p className="text-sm text-gray-400">
                    {integration.description}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  integration.status === "connected"
                    ? "bg-green-700 text-green-300"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {integration.status}
              </span>
            </div>
            <button
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                integration.status === "connected"
                  ? "bg-red-900 text-red-300 hover:bg-red-800"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
            >
              {integration.status === "connected" ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default IntegrationSettings;
