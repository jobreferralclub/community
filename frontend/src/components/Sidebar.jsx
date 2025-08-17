import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SafeIcon from "../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useAuthStore } from "../store/authStore";

const {
  FiHome,
  FiUsers,
  FiBarChart3,
  FiMail,
  FiVideo,
  FiAward,
  FiDollarSign,
  FiCalendar,
  FiBook,
  FiSettings,
  FiChevronLeft,
} = FiIcons;

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const role = useAuthStore((state) => state.role);
  const { user } = useAuthStore();
  const [openSubMenu, setOpenSubMenu] = React.useState("Community");
  const [openRegion, setOpenRegion] = React.useState("Community Hub");
  const currentLocation = useAuthStore((state) => state.location);

  const handleToggleSubMenu = (menuName) => {
    setOpenSubMenu(openSubMenu === menuName ? null : menuName);
  };

  const handleToggleRegion = (regionName) => {
    setOpenRegion(openRegion === regionName ? null : regionName);
  };

  // Helper function to check if any community route is active
  const isCommunityActive = () => {
    return location.pathname.includes('/community');
  };

  const menuItems = [
    // { name: "Dashboard", icon: FiHome, path: "/" },
    {
      name: "Community",
      icon: FiUsers,
      isSubmenu: true,
      children: [
        {
          name: "Community Hub",
          children: [
            { name: "Introductions", path: "/community/introductions" },
            { name: "Ask the Community", path: "/community/ask-the-community" },
            { name: "Announcements", path: "/community/announcements" },
            { name: "Club Guidelines", path: "/community/club-guidelines" },
          ],
        },
        {
          name: "India Jobs",
          region: "india",
          children: [
            { name: "Operations and Supply Chain Management", path: "/community/in/operations" },
            { name: "Program and Project Management", path: "/community/in/program" },
            { name: "Product Management", path: "/community/in/product" },
            { name: "Marketing Management", path: "/community/in/marketing" },
            { name: "Sales and Account Management", path: "/community/in/account" },
            { name: "Category and Vendor Management", path: "/community/in/category" },
            { name: "Finance", path: "/community/in/finance" },
            { name: "Human Resources", path: "/community/in/hr" },
            { name: "Analytics", path: "/community/in/analyst" },
            { name: "Strategy and Consulting", path: "/community/in/strategy" },
          ],
        },
        {
          name: "United States Jobs",
          region: "us",
          children: [
            { name: "Operations and Supply Chain Management", path: "/community/us/operations" },
            { name: "Program and Project Management", path: "/community/us/program" },
            { name: "Product Management", path: "/community/us/product" },
            { name: "Marketing Management", path: "/community/us/marketing" },
            { name: "Sales and Account Management", path: "/community/us/account" },
            { name: "Category and Vendor Management", path: "/community/us/category" },
            { name: "Finance", path: "/community/us/finance" },
            { name: "Human Resources", path: "/community/us/hr" },
            { name: "Analytics", path: "/community/us/analyst" },
            { name: "Strategy and Consulting", path: "/community/us/strategy" },
          ],
        },
      ],
    },
    { name: "Analytics", icon: FiBarChart3, path: "/analytics" },
    { name: "Email Broadcast", icon: FiMail, path: "/email" },
    { name: "Events", icon: FiVideo, path: "/videos" },
    { name: "Gamification", icon: FiAward, path: "/gamification" },
    { name: "Monetization", icon: FiDollarSign, path: "/monetization" },
    { name: "Coaching", icon: FiCalendar, path: "/coaching" },
    { name: "Course Builder", icon: FiBook, path: "/courses" },
    { name: "Settings", icon: FiSettings, path: "/settings" },
  ];

  const adminOnly = [
    "Dashboard",
    "Analytics",
    "Email Broadcast",
    "Gamification",
    "Monetization",
    "Coaching",
    "Course Builder",
  ];

  const filteredMenu =
    role === "admin"
      ? menuItems
      : menuItems.filter((item) => !adminOnly.includes(item.name));

  const filteredCommunity = filteredMenu.map((item) => {
    if (item.name === "Community") {
      return {
        ...item,
        children: item.children.filter(
          (child) => !child.region || child.region === currentLocation // keep hub + matching region
        ),
      };
    }
    return item;
  });

  // Classes for shadow/highlight
  const activeClass =
    "bg-gray-900 text-white border-r-2 border-[#aaff6c] shadow-[0_0_16px_2px_#aaff6c]";
  const hoverClass =
    "hover:bg-gray-900 hover:text-white hover:shadow-[0_0_12px_2px_#aaff6c] dark:hover:bg-gray-900 dark:hover:text-white dark:hover:shadow-[0_0_12px_2px_#aaff6c] transition-all";

  const renderMenuItem = (item) => {
    if (item.isSubmenu) {
      return (
        <button
          onClick={() => handleToggleSubMenu(item.name)}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 ${
            isCommunityActive()
              ? activeClass
              : `text-gray-300 dark:text-gray-300 ${hoverClass}`
          }`}
        >
          <div className="flex items-center space-x-3">
            <SafeIcon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
            {open && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-medium"
              >
                {item.name}
              </motion.span>
            )}
          </div>
          {open && (
            <SafeIcon
              icon={FiChevronLeft}
              className={`w-4 h-4 transition-transform ${
                openSubMenu === item.name ? "rotate-90" : ""
              }`}
            />
          )}
        </button>
      );
    }
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 ${
            isActive
              ? activeClass
              : `text-gray-300 dark:text-gray-300 ${hoverClass}`
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <SafeIcon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
          {open && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-medium"
            >
              {item.name}
            </motion.span>
          )}
        </div>
      </NavLink>
    );
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`${
        open ? "w-82" : "w-20"
      } bg-gray-900 shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JR</span>
              </div>
              <span className="font-bold text-gray-100">
                JobReferral.Club
              </span>
            </motion.div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <SafeIcon
              icon={FiChevronLeft}
              className={`w-5 h-5 text-gray-400 transition-transform ${
                !open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredCommunity.map((item) => (
          <div key={item.name}>
            {renderMenuItem(item)}
            {/* Submenu rendering */}
            {item.children && openSubMenu === item.name && open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="ml-6 mt-1 space-y-1"
              >
                {item.children.map((region) => (
                  <div key={region.name}>
                    <button
                      onClick={() => handleToggleRegion(region.name)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg text-gray-300 dark:text-gray-300 ${hoverClass}`}
                    >
                      {region.name}
                      <SafeIcon
                        icon={FiChevronLeft}
                        className={`w-4 h-4 transition-transform ${
                          openRegion === region.name ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {region.children && openRegion === region.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="ml-6 mt-1 space-y-1"
                      >
                        {region.children.map((sub) => (
                          <NavLink
                            key={sub.name}
                            to={sub.path}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isActive
                                  ? activeClass
                                  : `text-gray-400 dark:text-gray-400 ${hoverClass}`
                              }`
                            }
                          >
                            {sub.name}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>
      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatar || "/default-avatar.jpg"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium text-gray-100 truncate">
                {user.name || "Guest User"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
