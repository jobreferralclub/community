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
import Layout from "./components/community/Layout";
import Dashboard from "./pages/community/Dashboard";
import Community from "./pages/community/Community";
import Analytics from "./pages/community/Analytics";
import EmailBroadcast from "./pages/community/EmailBroadcast";
import VideoHub from "./pages/community/VideoHub";
import Gamification from "./pages/community/Gamification";
import Monetization from "./pages/community/Monetization";
import Coaching from "./pages/community/Coaching";
import CourseBuilder from "./pages/community/CourseBuilder";
import Settings from "./pages/community/Settings";
import Login from "./pages/Login";
import { useAuthStore } from "./store/authStore";
import AuthCallback from "./pages/community/AuthCallback";
import Landing from "./pages/LandingPage";
import ResumeBuilder from "./pages/resume/builder/ResumeBuilder";
import NotFound from "./pages/NotFound";
import ResumeBuilderQuestionnaire from "./pages/resume/builder/ResumeBuilderQuestionnaire";
import ResumeBuilderPreview from "./pages/resume/builder/ResumeBuilderPreview";
import ProfilePage from "./pages/ProfilePage";

function AppWrapper() {
  const { user, userId, login, setRole } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Fetch user role if logged in
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userId || userId.trim() === "") return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_PORT}/api/users/${userId}/role`,
          {
            headers: { Authorization: `Bearer ${userId}` },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
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

  // ✅ Handle token in URL
  useEffect(() => {
    if (tokenFromURL && !userId) {
      login({ _id: tokenFromURL });
      const cleanUrl =
        window.location.pathname + window.location.hash.split("?")[0];
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [tokenFromURL, userId, login]);

  // ✅ Check authentication & restore user
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (userId && !user) {
          const response = await fetch(
            `${import.meta.env.VITE_API_PORT}/api/users/${userId}`,
            {
              headers: { Authorization: `Bearer ${userId}` },
            }
          );

          if (response.ok) {
            const userData = await response.json();
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
            useAuthStore.getState().logout();
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        useAuthStore.getState().logout();
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    if (!authChecked) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [userId, user, login, authChecked]);

  // ✅ Show loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we set up your session.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* ✅ Landing page (always public) */}
        <Route path="/" element={<Landing />} />
        <Route path="/resume-builder">
          <Route index element={<ResumeBuilder />} />
          <Route path="questionnaire" element={<ResumeBuilderQuestionnaire/>}/>
          <Route path="preview" element={<ResumeBuilderPreview/>}/>
        </Route>
        <Route path="*" element={<NotFound/>} />

        {/* ✅ Public login route */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/community/introductions" replace /> : <Login />}
        />

        {isAuthenticated ? (
          <Route path="/profile" element={<ProfilePage/>} />
        ):(
          <Route path="/profile" element={<Navigate to="/login" replace />} />
        )}
        {/* ✅ Protected routes under /community */}
        {isAuthenticated ? (
          <Route
            path="/community/*"
            element={
              <div className="min-h-screen bg-gray-50">
                <Layout>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Routes>
                      <Route path="introductions" element={<Community />} />
                      <Route path="dashboard" element={<Dashboard />} />

                      {/* India sub-communities */}
                      <Route path="in/operations" element={<Community />} />
                      <Route path="in/program" element={<Community />} />
                      <Route path="in/product" element={<Community />} />
                      <Route path="in/marketing" element={<Community />} />
                      <Route path="in/account" element={<Community />} />
                      <Route path="in/category" element={<Community />} />
                      <Route path="in/finance" element={<Community />} />
                      <Route path="in/hr" element={<Community />} />
                      <Route path="in/analyst" element={<Community />} />
                      <Route path="in/strategy" element={<Community />} />
                      <Route path="in/freshers" element={<Community />} />

                      {/* US sub-communities */}
                      <Route path="us/operations" element={<Community />} />
                      <Route path="us/program" element={<Community />} />
                      <Route path="us/product" element={<Community />} />
                      <Route path="us/marketing" element={<Community />} />
                      <Route path="us/account" element={<Community />} />
                      <Route path="us/category" element={<Community />} />
                      <Route path="us/finance" element={<Community />} />
                      <Route path="us/hr" element={<Community />} />
                      <Route path="us/analyst" element={<Community />} />
                      <Route path="us/strategy" element={<Community />} />

                      {/* Global sub-communities */}
                      <Route path="ask-the-community" element={<Community />} />
                      <Route path="announcements" element={<Community />} />
                      <Route path="club-guidelines" element={<Community />} />

                      {/* Other authenticated routes */}
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/email" element={<EmailBroadcast />} />
                      <Route path="/videos" element={<VideoHub />} />
                      <Route path="/gamification" element={<Gamification />} />
                      <Route path="/monetization" element={<Monetization />} />
                      <Route path="/coaching" element={<Coaching />} />
                      <Route path="/courses" element={<CourseBuilder />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />

                      {/* Catch all for authenticated users */}
                      <Route path="*" element={<Navigate to="/community/introductions" replace />} />
                    </Routes>
                  </motion.div>
                </Layout>
              </div>
            }
          />
        ) : (
          // Redirect all unknown routes to login if not authenticated
          <Route path="/community/*" element={<Navigate to="/login" replace />} />
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
