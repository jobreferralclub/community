import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useAuth0 } from "@auth0/auth0-react";

const ProductsDropdown = ({ menuOpenSetter }) => {
  const { user } = useAuthStore();
  const { loginWithPopup } = useAuth0();
  const [productsOpen, setProductsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const products = [
    { label: "Resume Builder", to: "/resume-builder" },
    { label: "Resume Ranker", to: "/resume-ranker" },
    { label: "Resume Analyzer", to: "/resume-analyzer" },
    { label: "Mock Interviewer", to: "/mock-interviewer" },
  ];

  const handleClick = (to) => {
    if (user) {
      navigate(to);
      menuOpenSetter(false);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setProductsOpen(true)}
      onMouseLeave={() => setProductsOpen(false)}
    >
      <div className="flex items-center text-gray-300 hover:text-primary-green transition-all duration-300 font-medium cursor-pointer">
        Products
      </div>
      <AnimatePresence>
        {productsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 top-full mt-2 bg-black border border-gray-800 w-56 shadow-lg z-50 rounded-lg overflow-hidden"
          >
            {products.map((product, idx) => (
              <button
                key={idx}
                onClick={() => handleClick(product.to)}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-primary-green transition-colors duration-300"
              >
                {product.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="mb-6">You need to be logged in to access this tool.</p>
            <button
              onClick={() => {
                loginWithPopup();
                setShowLoginModal(false);
              }}
              className="px-6 py-2 bg-[#79e708] text-black font-bold rounded-lg hover:bg-[#5bb406] transition"
            >
              Login
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsDropdown;
