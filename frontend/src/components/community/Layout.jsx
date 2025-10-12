import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navigation from "../landing/Navigation";
import { useAuthStore } from "../../store/authStore";
import LocationModal from "./LocationModal";
import StatusModal from "./StatusModal";
import RoleModal from "./RoleModal";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth store context/state
  const { location, setLocation, user } = useAuthStore();
  const userId = user?._id;

  // Modal flow state
  const [status, setStatus] = useState(null);
  const [role, setRole] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Step 1: Location selected
  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setShowStatusModal(true); // Now prompt for status
  };

  // Step 2: Status selected
  const handleStatusSelect = (statusVal) => {
    setStatus(statusVal);
    setShowStatusModal(false);
    setShowRoleModal(true); // Now prompt for role
  };

  // Step 3: Role selected, update backend
  const handleRoleSelect = async (roleVal) => {
    setRole(roleVal);
    setShowRoleModal(false);

    if (!userId) return; // Prevent API call if not logged in

    try {
       await axios.put(`http://localhost:5000/api/users/${userId}/role`, { role: roleVal });
      // Optionally show success toast or update UI here
    } catch (err) {
      console.error("Failed to update user role", err);
      // Optionally show error toast
    }
  };

  return (
    <>
      {/* Main app layout */}
      <div className="flex h-screen bg-black text-gray-100 pt-16">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar open={true} setOpen={() => {}} />
        </div>
        {/* Mobile sidebar overlay & drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3 }}
                className="fixed inset-y-0 left-0 w-64 z-50 md:hidden"
              >
                <div className="h-full w-full bg-zinc-900 shadow-lg">
                  <Sidebar open={true} setOpen={setSidebarOpen} />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black">
          <Navigation setSidebarOpen={setSidebarOpen} />
          <motion.main
            className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-2 sm:p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <style>{`
              h1 { color: #ffffff !important; }
              h2, h3 { color: #d1d5db !important; }
              p, span, div.description { color: #9ca3af !important; }
            `}</style>
            <div className="max-w-7xl mx-auto">{children}</div>
          </motion.main>
        </div>
      </div>

      {/* Modals, controlled step-wise */}
      <LocationModal
        isOpen={location === null}
        onSelect={handleLocationSelect}
      />
      <StatusModal
        isOpen={location !== null && status === null && showStatusModal}
        onSelect={handleStatusSelect}
      />
      <RoleModal
        isOpen={location !== null && status !== null && role === null && showRoleModal}
        onSelect={handleRoleSelect}
      />
    </>
  );
};

export default Layout;
