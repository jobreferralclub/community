import React, { useState } from "react";
import { motion } from "framer-motion";
import SafeIcon from "../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useAuthStore } from "../store/authStore";

const {
  FiUser,
  FiBell,
  FiShield,
  FiGlobe,
  FiKey,
  FiDatabase,
  FiMail,
  FiSmartphone,
} = FiIcons;

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, updateUser } = useAuthStore();
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({ name: "", domain: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "profile", name: "Profile", icon: FiUser },
    { id: "notifications", name: "Notifications", icon: FiBell },
    { id: "privacy", name: "Privacy & Security", icon: FiShield },
    { id: "integrations", name: "Integrations", icon: FiGlobe },
    { id: "api", name: "API Access", icon: FiKey },
    { id: "data", name: "Data & Export", icon: FiDatabase },
    {
      id: "companies",
      name: "Registered Companies",
      icon: FiIcons.FiBriefcase,
    },
  ];

  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/companies");
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.domain) return;
    try {
      setIsSubmitting(true);
      await fetch("http://localhost:5001/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany),
      });
      setNewCompany({ name: "", domain: "" });
      fetchCompanies(); // refresh list
    } catch (error) {
      console.error("Error adding company:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  React.useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDeleteCompany = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;

    try {
      await fetch(`http://localhost:5001/api/companies/${id}`, {
        method: "DELETE",
      });
      fetchCompanies(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Profile Settings
      </h3>

      {/* Profile Photo */}
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Profile Photo</h4>
          <div className="flex space-x-3">
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Upload New
            </button>
            <button className="text-gray-600 hover:text-gray-800 transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            defaultValue={user.name}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue={user.email}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            placeholder="Senior Software Engineer"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            placeholder="Tech Corp"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="San Francisco, CA"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 123-4567"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          rows={4}
          placeholder="Tell us about yourself..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end mt-6">
        <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          Save Changes
        </button>
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Email Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <SafeIcon icon={FiMail} className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Email Notifications
          </h3>
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
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <SafeIcon icon={FiSmartphone} className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Push Notifications
          </h3>
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
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderPrivacy = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Privacy Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Privacy Settings
        </h3>
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
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">
                Two-factor authentication
              </p>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Change password</p>
              <p className="text-sm text-gray-600">
                Update your account password
              </p>
            </div>
            <button className="text-primary-600 hover:text-primary-700 transition-colors">
              Change
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Login sessions</p>
              <p className="text-sm text-gray-600">
                Manage your active sessions
              </p>
            </div>
            <button className="text-primary-600 hover:text-primary-700 transition-colors">
              View All
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderIntegrations = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Connected Integrations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
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
        ].map((integration) => (
          <div
            key={integration.name}
            className="p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.logo}</span>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {integration.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {integration.description}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  integration.status === "connected"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {integration.status}
              </span>
            </div>
            <button
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                integration.status === "connected"
                  ? "bg-red-50 text-red-700 hover:bg-red-100"
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

  const renderAPI = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* API Keys */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h3>
        <p className="text-gray-600 mb-6">
          Generate API keys to integrate with third-party applications.
        </p>

        <div className="space-y-4">
          {[
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
          ].map((key, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900">{key.name}</h4>
                <p className="text-sm text-gray-600">
                  Created: {key.created} • Last used: {key.lastUsed}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="text-primary-600 hover:text-primary-700 transition-colors">
                  View
                </button>
                <button className="text-red-600 hover:text-red-700 transition-colors">
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          Generate New Key
        </button>
      </div>

      {/* API Documentation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          API Documentation
        </h3>
        <p className="text-gray-600 mb-4">
          Learn how to integrate with our API endpoints.
        </p>
        <div className="space-y-3">
          {[
            "Authentication & Authorization",
            "User Management",
            "Community Posts",
            "Job Referrals",
            "Analytics Data",
            "Webhooks",
          ].map((topic) => (
            <a
              key={topic}
              href="#"
              className="block p-3 border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors"
            >
              {topic}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderData = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Data Export */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Export Your Data
        </h3>
        <p className="text-gray-600 mb-6">
          Download a copy of your data in various formats.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
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
          ].map((dataType) => (
            <div
              key={dataType.name}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <h4 className="font-medium text-gray-900 mb-1">
                {dataType.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {dataType.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {dataType.format}
                </span>
                <button className="text-primary-600 hover:text-primary-700 transition-colors">
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-4">
          Delete Account
        </h3>
        <p className="text-gray-600 mb-6">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Delete Account
        </button>
      </div>
    </motion.div>
  );

  const renderCompanies = () => {
    const filteredCompanies = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Form to add new company */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Company
          </h3>
          <form
            onSubmit={handleAddCompany}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Company Name"
              className="p-3 border border-gray-300 rounded-lg"
              value={newCompany.name}
              onChange={(e) =>
                setNewCompany({ ...newCompany, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Company Domain (e.g. example.com)"
              className="p-3 border border-gray-300 rounded-lg"
              value={newCompany.domain}
              onChange={(e) =>
                setNewCompany({ ...newCompany, domain: e.target.value })
              }
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {isSubmitting ? "Adding..." : "Add Company"}
              </button>
            </div>
          </form>
        </div>

        {/* List of registered companies */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or domain..."
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Registered Companies
          </h3>

          <div className="divide-y divide-gray-100">
            {filteredCompanies.length === 0 ? (
              <p className="text-gray-600">No companies registered yet.</p>
            ) : (
              filteredCompanies.map((company, idx) => (
                <div
                  key={company._id || idx}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900">{company.name}</p>
                    <p className="text-sm text-gray-600">{company.domain}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCompany(company._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account preferences and configurations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && renderProfile()}
          {activeTab === "notifications" && renderNotifications()}
          {activeTab === "privacy" && renderPrivacy()}
          {activeTab === "integrations" && renderIntegrations()}
          {activeTab === "api" && renderAPI()}
          {activeTab === "data" && renderData()}
          {activeTab === "companies" && renderCompanies()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
