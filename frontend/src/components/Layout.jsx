import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore } from '../store/authStore';
import LocationModal from './LocationModal';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { location, setLocation } = useAuthStore(); // get setter

  console.log("Current location:", location);

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          <motion.main
            className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.main>
        </div>
      </div>

      {/* Show location modal only if not set */}
      <LocationModal 
        isOpen={location === null} 
        onSelect={(loc) => setLocation(loc)} 
      />
    </>
  );
};

export default Layout;
