import React from "react";
import { motion } from "framer-motion";
import SafeIcon from "../../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";

const { FiMenu, FiBell, FiSearch, FiMessageSquare, FiAward, FiLogOut } = FiIcons;

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiMenu} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Search bar */}
          <div className="relative hidden md:block flex-1">
            <SafeIcon
              icon={FiSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
            />
            <input
              type="text"
              placeholder="Search community, jobs, members..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Points */}
          <div className="hidden sm:flex items-center space-x-2 bg-secondary-50 dark:bg-secondary-900/50 px-3 py-1 rounded-full">
            <SafeIcon icon={FiAward} className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {user.points} pts
            </span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Messages */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <SafeIcon icon={FiMessageSquare} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></span>
          </button>

          {/* Profile with dropdown */}
          <div className="relative group">
            <div className="flex items-center space-x-3 cursor-pointer">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
              </div>
            </div>

            {/* Dropdown on hover */}
            <div className="absolute right-0 top-7 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all z-20 pointer-events-none group-hover:pointer-events-auto">
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
