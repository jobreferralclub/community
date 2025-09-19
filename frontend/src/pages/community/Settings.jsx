import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // 👈 add this
import SafeIcon from "../../common/SafeIcon";
import { useAuthStore } from "../../store/authStore";
import { tabs, adminOnly } from "../../data/settingList";
import ProfileSettings from "./settings/ProfileSettings";
import NotificationSettings from "./settings/NotificationSettings";
import PrivacySettings from "./settings/PrivacySettings";
import IntegrationSettings from "./settings/IntegrationSettings";
import ApiSettings from "./settings/ApiSettings";
import DataExportSettings from "./settings/DataExportSettings";
import CompanySettings from "./settings/CompanySettings";
import UserSettings from "./settings/UserSettings";
import ResumeSettings from "./settings/ResumeSettings";
import Footer from "../../components/landing/Footer";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const pageParam = query.get("page");

  // ------------------------------------------
  // State and Store
  // ------------------------------------------
  const [activeTab, setActiveTab] = useState(pageParam || "profile"); // 👈 default to query
  const { user } = useAuthStore();
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const role = useAuthStore((state) => state.role);

  // ------------------------------------------
  // Sync activeTab with URL
  // ------------------------------------------
  useEffect(() => {
    if (pageParam && pageParam !== activeTab) {
      setActiveTab(pageParam);
    }
  }, [pageParam]);

  const handleTabClick = (id) => {
    setActiveTab(id);
    navigate(`?page=${id}`); // 👈 updates URL without reload
  };

  // ------------------------------------------
  // Fetch Effects
  // ------------------------------------------
  useEffect(() => {
    fetchCompanies();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/companies`);
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  // ------------------------------------------
  // MAIN RETURN (DARK MODE WRAPPER)
  // ------------------------------------------
  return (
    <>
      <div className="space-y-6 bg-black min-h-screen p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">
            Manage your account preferences and configurations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-s rounded-e p-4 shadow-md border border-gray-700">
              <nav className="space-y-2">
                {tabs.map((tab) =>
                  adminOnly.includes(tab.name) && role !== "admin" ? null : (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)} // 👈 use handler
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-s rounded-e text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary-green !text-black"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <SafeIcon icon={tab.icon} className="w-5 h-5" />
                      <span
                        className={`font-medium ${
                          activeTab === tab.id ? "!text-black" : ""
                        }`}
                      >
                        {tab.name}
                      </span>
                    </button>
                  )
                )}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && <ProfileSettings user={user} />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "privacy" && <PrivacySettings />}
            {activeTab === "integrations" && <IntegrationSettings />}
            {activeTab === "api" && <ApiSettings />}
            {activeTab === "data" && <DataExportSettings />}
            {activeTab === "companies" && <CompanySettings />}
            {activeTab === "users" && <UserSettings />}
            {activeTab === "resume" && <ResumeSettings />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
