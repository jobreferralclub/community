import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore } from '../store/authStore';
import LocationModal from './LocationModal';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { location, setLocation } = useAuthStore();

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden bg-gray-800">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          <motion.main
            className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <style>{`
              h1 {
                color: #ffffff !important; /* bright white */
              }
              h2, h3 {
                color: #d1d5db !important; /* light gray (text-gray-300) */
              }
              p, span, div.description {
                color: #9ca3af !important; /* slightly lighter gray (text-gray-400) */
              }
            `}</style>

            <div>
              {children}
            </div>
          </motion.main>
        </div>
      </div>

      <LocationModal 
        isOpen={location === null} 
        onSelect={(loc) => setLocation(loc)} 
      />
    </>
  );
};

export default Layout;
