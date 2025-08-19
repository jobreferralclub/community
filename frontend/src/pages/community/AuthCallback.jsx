// AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        toast.error("Login failed.");
        return navigate("/login");
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const finalUser = await res.json();

        const roleParam =
          new URLSearchParams(window.location.search).get("role") || "referrer";

        login({
          ...finalUser,
          role: roleParam,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          points: 2450,
          badges: ["Top Referrer", "Community Helper", "Mentor"],
          tier: "premium",
        });

        navigate("/dashboard");
      } catch (err) {
        toast.error("Failed to fetch user data.");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [location.search, login, navigate]);

  return <p className="text-center p-4">Logging in...</p>;
};

export default AuthCallback;
