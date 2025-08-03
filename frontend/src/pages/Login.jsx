import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SafeIcon from "../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const { FiMail, FiLock, FiEye, FiEyeOff } = FiIcons;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const [userType, setUserType] = useState("jobseeker");
  const [formError, setFormError] = useState("");

  const [companies, setCompanies] = useState([]);
  const [selectedCompanyDomain, setSelectedCompanyDomain] = useState("");
  const [showCompanySearch, setShowCompanySearch] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");


  const { login } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userType === "referrer" && isSignup) {
      fetch("http://localhost:5001/api/companies")
        .then((res) => res.json())
        .then((data) => setCompanies(data))
        .catch((err) => {
          console.error("Failed to fetch companies", err);
          toast.error("Failed to load companies");
        });
    }
  }, [userType, isSignup]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("token");

    const fetchUser = async () => {
      try {
        const googleRes = await fetch(
          `http://localhost:5001/api/google-user-info/${userId}`
        );
        const googleUser = await googleRes.json();

        if (!googleRes.ok)
          throw new Error(googleUser?.error || "Google auth failed");

        // Send Google user data to backend to store/lookup
        const response = await fetch("http://localhost:5001/api/users/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: googleUser.email,
            name: googleUser.name,
          }),
        });

        const finalUser = await response.json();
        if (!response.ok)
          throw new Error(finalUser?.error || "User fetch failed");

        login({
          ...finalUser,
          role: "jobseeker",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          points: 2450,
          badges: ["Top Referrer", "Community Helper", "Mentor"],
          tier: "premium",
        });

        toast.success("Logged in with Google");
        navigate("/");
      } catch (err) {
        toast.error("Google login failed");
        console.error(err);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [location.search, login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignup
      ? "http://localhost:5001/api/users"
      : "http://localhost:5001/api/users/login";

    const payload = isSignup
      ? {
          name: "Alex Johnson", // optional: could use formData.name
          email: formData.email,
          password: formData.password,
        }
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data?.error || "Request failed");
      }

      login({
        ...data,
        role: userType,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        points: 2450,
        badges: ["Top Referrer", "Community Helper", "Mentor"],
        tier: "premium",
      });

      toast.success(isSignup ? "Signup successful!" : "Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      const message = error?.message || "Something went wrong";
      setFormError(message);
      toast.error(message);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">JR</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">JobReferral.Club</h1>
          <p className="text-gray-600 mt-1">
            {isSignup
              ? "Create your account"
              : "Welcome back to your community"}
          </p>
        </div>

        {/* Toggle Role */}
        <div className="flex justify-center gap-4 mb-6">
          {["jobseeker", "referrer"].map((role) => (
            <button
              key={role}
              onClick={() => setUserType(role)}
              className={`px-4 py-1 text-sm font-medium rounded-full border ${
                userType === role
                  ? "bg-primary-600 text-white border-primary-600"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {role === "jobseeker" ? "Job Seeker" : "Referrer"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Company Search (for Referrers in Signup mode) */}
          {userType === "referrer" && isSignup && (
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                onFocus={() => setShowCompanySearch(true)}
                onChange={(e) => {
                  const search = e.target.value.toLowerCase();
                  const filtered = allCompanies.filter((c) =>
                    c.name.toLowerCase().includes(search)
                  );
                  setCompanies(filtered);
                }}
                placeholder="Search your company"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {selectedCompanyName && (
                <p className="mt-1 text-sm text-gray-500">
                  Selected Company:{" "}
                  <span className="font-medium text-gray-800">
                    {selectedCompanyName}
                  </span>
                </p>
              )}
              {showCompanySearch && companies.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-md z-20">
                  {companies.map((company) => (
                    <li
                      key={company._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        const domain = company.domain.replace(/^@/, "");
                        setSelectedCompanyDomain(domain);
                        setSelectedCompanyName(company.name);
                        setShowCompanySearch(false);
                        setFormData({
                          ...formData,
                          email: `@${domain}`,
                        });
                      }}
                    >
                      {company.name}{" "}
                      <span className="text-sm text-gray-400">
                        ({company.domain})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <SafeIcon
                icon={FiMail}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <input
                type="text"
                value={formData.email.split("@")[0] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: `${e.target.value}@${selectedCompanyDomain}`,
                  })
                }
                className="w-full pl-10 pr-28 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your email"
                required
              />
              {selectedCompanyDomain && (
                <span className="absolute right-4 text-gray-500 text-sm pointer-events-none select-none">
                  @{selectedCompanyDomain}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <SafeIcon
                icon={FiLock}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon
                  icon={showPassword ? FiEyeOff : FiEye}
                  className="w-5 h-5"
                />
              </button>
            </div>
            {formError && (
              <p className="text-sm text-red-600 mt-1">{formError}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700"
          >
            {isSignup ? "Create Account" : "Sign In"}
          </motion.button>
        </form>

        {/* Google Login */}
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>

        {/* Toggle Login/Signup */}
        <p className="text-center text-sm text-gray-600 mt-6">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary-600 hover:underline font-medium"
          >
            {isSignup ? "Login here" : "Sign up here"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
