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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const [formError, setFormError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [selectedCompanyDomain, setSelectedCompanyDomain] = useState("");
  const [showCompanySearch, setShowCompanySearch] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");

  // OTP States
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("accountRole") || "member";

  // Fetch companies list (for recruiter, tpo roles)
  useEffect(() => {
    if (["recruiter", "tpo"].includes(roleParam) && isSignup) {
      fetch("http://localhost:5001/api/companies")
        .then((res) => res.json())
        .then((data) => setCompanies(data))
        .catch((err) => {
          console.error("Failed to fetch companies", err);
          toast.error("Failed to load companies");
        });
    }
  }, [roleParam, isSignup]);

  // Handle Google OAuth callback
  useEffect(() => {
    const token = searchParams.get("token");
    const roleFromUrl = searchParams.get("role") || roleParam;

    const fetchGoogleUser = async () => {
      if (!token) return;

      setIsGoogleLoading(true);
      try {
        const googleRes = await fetch(
          `http://localhost:5001/api/auth/google-user-info/${token}`
        );
        const userData = await googleRes.json();

        if (!googleRes.ok) {
          throw new Error(userData?.error || "Google authentication failed");
        }

        // Store user data in auth store
        login({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: roleFromUrl,
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          points: 2450,
          badges: ["Top Referrer", "Community Helper", "Mentor"],
          tier: "premium",
          isGoogleUser: true
        });

        toast.success("Successfully logged in with Google!");
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Google login error:", error);
        toast.error(error.message || "Google login failed");
        navigate("/login", { replace: true });
      } finally {
        setIsGoogleLoading(false);
      }
    };
    fetchGoogleUser();
  }, [location.search, login, navigate, roleParam]);

  // Handle sending OTP
  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setIsOtpSent(true);
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setIsOtpVerified(true);
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Error verifying OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle login/signup submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // For signup, only allow if OTP is verified
    if (isSignup && !isOtpVerified) {
      setFormError("Please verify your email via OTP to proceed.");
      return;
    }

    const url = isSignup
      ? "http://localhost:5001/api/users"
      : "http://localhost:5001/api/users/login";

    const payload = isSignup
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          accountRole: roleParam,
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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Request failed");
      }

      login({
        ...data,
        role: roleParam,
        avatar: "/default-avatar.jpg",
        points: 2450,
        badges: ["Top Referrer", "Community Helper", "Mentor"],
        tier: "premium",
      });

      toast.success(isSignup ? "Signup successful!" : "Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error?.message || "Something went wrong";
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `http://localhost:5001/api/auth/google?role=${roleParam}`;
    window.location.href = googleAuthUrl;
  };

  // Show loading state during Google authentication
  if (isGoogleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
        >
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Completing Google Sign In...
          </h2>
          <p className="text-gray-600">Please wait while we set up your account.</p>
        </motion.div>
      </div>
    );
  }

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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field (Signup only) */}
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <SafeIcon
                  icon={FiIcons.FiUser}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          {/* Company Search (for recruiter/tpo) */}
          {["recruiter", "tpo"].includes(roleParam) && isSignup && (
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                onFocus={() => setShowCompanySearch(true)}
                onChange={(e) => {
                  const search = e.target.value.toLowerCase();
                  const filtered = companies.filter((c) =>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            {roleParam === "recruiter" && selectedCompanyDomain ? (
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
                <span className="absolute right-4 text-gray-500 text-sm pointer-events-none select-none">
                  @{selectedCompanyDomain}
                </span>
              </div>
            ) : (
              <div className="relative flex items-center">
                <SafeIcon
                  icon={FiMail}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}
          </div>

          {/* Password Field */}
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

          {/* OTP Section (Signup only) */}
          {isSignup && (
            <div className="space-y-3">
              {/* If not sent, show send-otp button */}
              {!isOtpSent ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full bg-primary-100 text-primary-700 py-2 rounded-lg font-medium border border-primary-200 hover:bg-primary-200"
                  disabled={otpLoading || !formData.email}
                >
                  {otpLoading ? "Sending OTP..." : "Send OTP to Email"}
                </motion.button>
              ) : (
                // After sending, show OTP input and verify button
                !isOtpVerified && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      required
                      className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleVerifyOtp}
                      className="w-1/3 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700"
                      disabled={otpLoading || !otp}
                    >
                      {otpLoading ? "Verifying..." : "Verify OTP"}
                    </motion.button>
                  </div>
                )
              )}
              {/* Success Message */}
              {isOtpVerified && (
                <p className="text-sm text-green-700">
                  Email verified! You may proceed to sign up.
                </p>
              )}
            </div>
          )}


          {/* Create Account / Sign up button*/}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 ${
              isSignup && !isOtpVerified ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSignup && !isOtpVerified}
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
            onClick={() => {
              setIsSignup(!isSignup);
              setFormError("");
              setOtp("");           // Reset OTP states on toggling
              setIsOtpSent(false);
              setIsOtpVerified(false);
            }}
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
