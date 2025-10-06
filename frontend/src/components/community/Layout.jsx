import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navigation from "../landing/Navigation";
import { useAuthStore } from "../../store/authStore";
import LocationModal from "./LocationModal";
import StatusModal from './StatusModal';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { location, setLocation } = useAuthStore();

  // Add state for professional status
  const [status, setStatus] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setShowStatusModal(true);  // Show status modal after location is picked
  };

  const handleStatusSelect = (statusVal) => {
    setStatus(statusVal);
    setShowStatusModal(false);
    // Here, consider persisting the selected status to your user store/profile.
  };

  return (
    <>
      <div className="flex h-screen bg-black text-gray-100 pt-16">
        <div className="hidden md:flex">
          <Sidebar open={true} setOpen={() => {}} />
        </div>
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
      <LocationModal
        isOpen={location === null}
        onSelect={handleLocationSelect}
      />
      <StatusModal
        isOpen={location !== null && status === null && showStatusModal}
        onSelect={handleStatusSelect}
      />
    </>
  );
};

export default Layout;
