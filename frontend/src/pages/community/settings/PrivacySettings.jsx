// =========================================================
// PrivacySettings.jsx
// Full-featured privacy + security settings
// Converted from renderPrivacy
// Uses TailwindCSS + Framer Motion
// =========================================================

import React from "react";
import { motion } from "framer-motion";

const PrivacySettings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Privacy Settings */}
      <div className="bg-zinc-900 rounded-xl p-6 shadow-md border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          {[
            {
              name: "Profile visibility",
              description: "Who can see your profile information",
              options: ["Public", "Members only", "Private"],
            },
            {
              name: "Activity status",
              description: "Show when you're online",
              options: ["Everyone", "Connections only", "Nobody"],
            },
            {
              name: "Contact information",
              description: "Who can see your email and phone",
              options: ["Public", "Members only", "Private"],
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <select className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                {item.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-zinc-900 rounded-xl p-6 shadow-md border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-white">Two-factor authentication</p>
              <p className="text-sm text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-white">Change password</p>
              <p className="text-sm text-gray-400">Update your account password</p>
            </div>
            <button className="text-primary-600 hover:text-primary-700 transition-colors">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-white">Login sessions</p>
              <p className="text-sm text-gray-400">Manage your active sessions</p>
            </div>
            <button className="text-primary-600 hover:text-primary-700 transition-colors">
              View All
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacySettings;
