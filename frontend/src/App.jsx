import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Analytics from "./pages/Analytics";
import EmailBroadcast from "./pages/EmailBroadcast";
import VideoHub from "./pages/VideoHub";
import Gamification from "./pages/Gamification";
import Monetization from "./pages/Monetization";
import Coaching from "./pages/Coaching";
import CourseBuilder from "./pages/CourseBuilder";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { useAuthStore } from "./store/authStore";
import AuthCallback from "./pages/AuthCallback";

function AppWrapper() {
  const { user, userId, login, setRole } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  // ✅ Get user role only if there is a token
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userId || userId.trim() === "") return; // Exit early if no token

      try {
        const res = await fetch(
          `http://localhost:5001/api/users/${userId}/role`,
          {
            headers: {
              Authorization: `Bearer ${userId}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch user role");
          return;
        }

        const data = await res.json();
        console.log("User role:", data.role);

        // Store in Zustand
        setRole(data.role);
      } catch (err) {
        console.error("Error fetching role:", err);
      }
    };

    fetchUserRole();
  }, [userId, setRole]);

  const searchParams = new URLSearchParams(location.search);
  const tokenFromURL = searchParams.get("token");

  const isAuthenticated = !!(userId && user);

  // Handle token from URL and store it as userId
  useEffect(() => {
    if (tokenFromURL && !userId) {
      // Store token as userId in the auth store
      login({ _id: tokenFromURL });

      // Clean up URL by removing token parameter
      const cleanUrl =
        window.location.pathname + window.location.hash.split("?")[0];
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [tokenFromURL, userId, login]);

  // Check if user is authenticated and restore user data if needed
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If we have a userId (token) but no user data in memory, fetch user data
        if (userId && !user) {
          const response = await fetch(
            `http://localhost:5001/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${userId}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            // Restore user data to memory with additional properties
            login({
              ...userData,
              avatar:
                userData.avatar ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
              points: userData.points || 2450,
              badges: userData.badges || [
                "Top Referrer",
                "Community Helper",
                "Mentor",
              ],
              tier: userData.tier || "premium",
            });
          } else {
            // If token is invalid, clear it
            useAuthStore.getState().logout();
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // On error, clear invalid token
        useAuthStore.getState().logout();
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    // Only run auth check if we haven't checked yet
    if (!authChecked) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [userId, user, login, authChecked]);

  // Show loading spinner while checking authentication
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait while we set up your session.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gray-50">
                <Layout>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/community">
                        <Route index element={<Community />} />

                        {/* India sub-communities */}
                        <Route
                          path="in/operations"
                          element={<Community/>}
                        />
                        <Route path="in/program" element={<Community/>} />
                        <Route path="in/product" element={<Community/>} />
                        <Route path="in/marketing" element={<Community/>} />
                        <Route path="in/account" element={<Community/>} />

                        {/* US sub-communities */}
                        <Route
                          path="us/operations"
                          element={<Community/>}
                        />
                        <Route path="us/program" element={<Community/>} />
                        <Route path="us/product" element={<Community/>} />
                        <Route path="us/marketing" element={<Community/>} />
                        <Route path="us/account" element={<Community/>} />
                      </Route>
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/email" element={<EmailBroadcast />} />
                      <Route path="/videos" element={<VideoHub />} />
                      <Route path="/gamification" element={<Gamification />} />
                      <Route path="/monetization" element={<Monetization />} />
                      <Route path="/coaching" element={<Coaching />} />
                      <Route path="/courses" element={<CourseBuilder />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      {/* Catch all route for authenticated users */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </motion.div>
                </Layout>
              </div>
            }
          />
        ) : (
          // Redirect to /login if not authenticated
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
