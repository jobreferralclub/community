import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        {user ? (
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
                      <Route path="/community" element={<Community />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/email" element={<EmailBroadcast />} />
                      <Route path="/videos" element={<VideoHub />} />
                      <Route path="/gamification" element={<Gamification />} />
                      <Route path="/monetization" element={<Monetization />} />
                      <Route path="/coaching" element={<Coaching />} />
                      <Route path="/courses" element={<CourseBuilder />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </motion.div>
                </Layout>
              </div>
            }
          />
        ) : (
          // Redirect to /login if not logged in
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
