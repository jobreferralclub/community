// =========================================================
// NotificationSettings.jsx
// Full-featured notification settings component
// Converted from renderNotifications
// Uses TailwindCSS + Framer Motion + SafeIcon
// =========================================================

import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiSmartphone } from "react-icons/fi";
import SafeIcon from "../../../common/SafeIcon";

const NotificationSettings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Email Notifications */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <SafeIcon icon={FiMail} className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            {
              name: "New job referrals",
              description: "Get notified when new job opportunities are posted",
            },
            {
              name: "Community activity",
              description: "Updates on posts, comments, and mentions",
            },
            {
              name: "Mentorship requests",
              description: "When someone requests a mentorship session",
            },
            {
              name: "Weekly digest",
              description: "Summary of community activity and opportunities",
            },
            {
              name: "System updates",
              description: "Important platform updates and maintenance notices",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0"
            >
              <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <SafeIcon icon={FiSmartphone} className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            {
              name: "Direct messages",
              description: "Instant notifications for private messages",
            },
            {
              name: "Meeting reminders",
              description: "Alerts 15 minutes before scheduled sessions",
            },
            {
              name: "Achievement unlocked",
              description: "When you earn new badges or reach milestones",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0"
            >
              <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;
