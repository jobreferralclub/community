import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SafeIcon from "../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const { FiMail, FiLock, FiEye, FiEyeOff, FiUser } = FiIcons;

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

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("accountRole") || "member";

  // fetch companies if recruiter/tpo signup
  useEffect(() => {
    if (["recruiter", "tpo"].includes(roleParam) && isSignup) {
      fetch(`${import.meta.env.VITE_API_PORT}/api/companies`)
        .then((res) => res.json())
        .then((data) => setCompanies(data))
        .catch((err) => {
          console.error("Failed to fetch companies", err);
          toast.error("Failed to load companies");
        });
    }
  }, [roleParam, isSignup]);

  // handle google login
  useEffect(() => {
    const token = searchParams.get("token");
    const roleFromUrl = searchParams.get("role") || roleParam;

    const fetchGoogleUser = async () => {
      if (!token) return;
      setIsGoogleLoading(true);
      try {
        const googleRes = await fetch(
          `${import.meta.env.VITE_API_PORT}/api/auth/google-user-info/${token}`
        );
        const userData = await googleRes.json();

        if (!googleRes.ok) {
          throw new Error(userData?.error || "Google authentication failed");
        }

        login({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: roleFromUrl,
          avatar: "/default-avatar.jpg",
          points: 2450,
          badges: ["Top Referrer", "Community Helper", "Mentor"],
          tier: "premium",
          isGoogleUser: true,
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

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_PORT}/api/auth/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setIsOtpSent(true);
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch {
      toast.error("Error sending OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_PORT}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setIsOtpVerified(true);
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch {
      toast.error("Error verifying OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (isSignup && !isOtpVerified) {
      setFormError("Please verify your email via OTP to proceed.");
      return;
    }

    const url = isSignup
      ? `${import.meta.env.VITE_API_PORT}/api/users`
      : `${import.meta.env.VITE_API_PORT}/api/users/login`;

    const payload = isSignup
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          accountRole: roleParam,
          companyDomain:
            roleParam === "recruiter" || roleParam === "tpo"
              ? selectedCompanyDomain
              : undefined,
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
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error?.message || "Something went wrong";
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleToggleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_PORT}/api/auth/google?role=${roleParam}`;
  };

  const handleToggleSignup = () => {
    setIsSignup((prev) => !prev);
    setFormError("");
    setOtp("");
    setIsOtpSent(false);
    setIsOtpVerified(false);
  };

  if (isGoogleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900 rounded-3xl p-8 shadow-xl w-full max-w-md text-center"
        >
          <div className="w-16 h-16 bg-[#79e708] rounded-xl flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Completing Google Sign In...
          </h2>
          <p className="text-gray-400">
            Please wait while we set up your account.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-lg"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#79e708] rounded-xl flex items-center justify-center mx-auto mb-4">
            <img src="/logo.jpg" alt="" />
          </div>
          <h1 className="text-3xl font-bold text-white">JobReferral.Club</h1>
          <p className="text-gray-400 mt-1">
            {isSignup
              ? "Create your account"
              : "Welcome back to your community"}
          </p>
          <div className="text-center mt-2">
            <p className="text-[#79e708] text-lg font-semibold">
              {isSignup ? "Sign Up" : "Login"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Full Name
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiUser}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-10 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-[#79e708]"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          {/* Company Search */}
          {(roleParam === "recruiter" || roleParam === "tpo") && isSignup && (
            <div className="relative">
              <label className="block text-gray-300 text-sm mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={selectedCompanyName}
                onChange={(e) => {
                  setSelectedCompanyName(e.target.value);
                  setShowCompanySearch(true);
                }}
                onFocus={() => setShowCompanySearch(true)}
                className="w-full py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-[#79e708] px-3"
                placeholder="Search for your company"
                required
              />
              {showCompanySearch && selectedCompanyName && (
                <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-lg mt-1 max-h-40 overflow-y-auto">
                  {companies
                    .filter((c) =>
                      c.name
                        .toLowerCase()
                        .includes(selectedCompanyName.toLowerCase())
                    )
                    .map((c) => (
                      <li
                        key={c._id}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-600 text-white"
                        onClick={() => {
                          setSelectedCompanyName(c.name);
                          setSelectedCompanyDomain(c.domain);
                          setShowCompanySearch(false);
                        }}
                      >
                        {c.name} ({c.domain})
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Email Address
            </label>
            <div className="relative">
              <SafeIcon
                icon={FiMail}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-[#79e708]"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              {isSignup ? "Create Password" : "Password"}
            </label>
            <div className="relative">
              <SafeIcon
                icon={FiLock}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-[#79e708]"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                <SafeIcon
                  icon={showPassword ? FiEyeOff : FiEye}
                  className="w-5 h-5"
                />
              </button>
            </div>
            {formError && (
              <p className="text-red-400 mt-1 text-sm">{formError}</p>
            )}
          </div>

          {/* OTP */}
          {isSignup && (
            <div className="space-y-3">
              {!isOtpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  className="w-full py-2 rounded-lg bg-[#79e708] hover:bg-[#79e708]/90 text-black"
                >
                  {otpLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : !isOtpVerified ? (
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full py-3 px-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-[#79e708]"
                    placeholder="Enter OTP"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading}
                    className="w-full mt-2 py-2 rounded-lg bg-[#79e708] hover:bg-[#79e708]/90 text-black"
                  >
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              ) : (
                <p className="text-[#79e708] text-sm">OTP Verified!</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSignup && !isOtpVerified}
            className={`w-full py-3 rounded-lg font-medium ${
              isSignup && !isOtpVerified
                ? "bg-[#79e708] text-black opacity-50 cursor-not-allowed"
                : "bg-[#79e708] text-black hover:bg-[#79e708]/90"
            } transition-colors`}
          >
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        {/* Google Login */}
        <div className="mt-4">
          <button
            onClick={handleToggleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>

        {/* Toggle Signup/Login */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={handleToggleSignup}
            className="text-[#79e708] hover:underline font-medium"
          >
            {isSignup ? "Login here" : "Sign up here"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
