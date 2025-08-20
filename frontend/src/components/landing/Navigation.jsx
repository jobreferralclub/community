import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Categories", href: "#categories" },
    { label: "Success Stories", href: "#stories" },
    { label: "Simulations", href: "#practice" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 transition-all duration-300"
          >
            <img
              src="/logo.jpg"
              alt="JobReferral.Club Logo"
              className="w-12 h-12 object-contain rounded-full"
            />
            <div className="font-bold text-xl text-white whitespace-nowrap">
              JobReferral<span className="text-primary-green">.Club</span>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="text-gray-300 hover:text-primary-green transition-all duration-300 font-medium relative group whitespace-nowrap"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-green transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <div className="flex items-center text-gray-300 hover:text-primary-green transition-all duration-300 font-medium cursor-pointer">
                Services
                <ChevronDown className="w-4 h-4 ml-1" />
              </div>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 top-full mt-2 bg-black rounded-lg border border-gray-800 w-56 shadow-lg z-50 overflow-hidden"
                  >
                    {[
                      { label: "Resume Builder", href: "./resume-builder" },
                      { label: "Resume Ranker", href: "./resume-ranker" },
                      { label: "Resume Analyzer", href: "./resume-analyzer" },
                    ].map((service, idx) => (
                      <a
                        key={idx}
                        href={service.href}
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-primary-green transition-colors duration-300"
                      >
                        {service.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              {user ? (
                <div
                  className="relative flex items-center gap-2 cursor-pointer"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-primary-green"
                  />
                  <span className="text-gray-300 font-medium">{user.name}</span>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-0 mt-12 bg-black rounded-lg border border-gray-800 w-48 shadow-lg z-50 overflow-hidden"
                      >
                        <a
                          href="/community"
                          className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-primary-green transition-colors duration-300"
                        >
                          Continue to Community
                        </a>
                        <a
                          href="/profile"
                          className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-primary-green transition-colors duration-300"
                        >
                          User Profile
                        </a>
                        <button
                          onClick={() => logout()}
                          className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-500 transition-colors duration-300"
                        >
                          Log Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  onClick={() => (window.location.href = "/login")}
                  className="btn-primary group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-green/20 whitespace-nowrap"
                >
                  Sign In / Sign Up
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              )}
            </div>

            {/* Mobile menu icon */}
            <div className="lg:hidden">
              {menuOpen ? (
                <X
                  className="w-6 h-6 text-white cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                />
              ) : (
                <Menu
                  className="w-6 h-6 text-white cursor-pointer"
                  onClick={() => setMenuOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden mt-2 bg-black px-4 py-4 rounded-b-lg border-t border-gray-800 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-300 hover:text-primary-green transition-colors duration-300 font-medium"
                  >
                    {item.label}
                  </a>
                ))}
                {user ? (
                  <>
                    <a
                      href="/community"
                      className="text-gray-300 hover:text-primary-green transition-colors duration-300 font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      Continue to Community
                    </a>
                    <a
                      href="/profile"
                      className="text-gray-300 hover:text-primary-green transition-colors duration-300 font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      User Profile
                    </a>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="text-red-400 hover:text-red-500 transition-colors duration-300 text-left"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      window.location.href = "/login";
                      setMenuOpen(false);
                    }}
                    className="btn-primary group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-green/20"
                  >
                    Sign In / Sign Up
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
