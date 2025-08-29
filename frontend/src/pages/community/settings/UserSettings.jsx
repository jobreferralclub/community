// =========================================================
// UserSettings.jsx (Dark Mode)
// Full-featured user management screen with real API fetch:
// - Fetch all users from backend
// - Change roles via dropdown (persist to backend)
// - Show join date
// - Responsive, styled with Tailwind
// =========================================================

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const UserSettings = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users from backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/users`); // 🔗 replace with your backend route
        const data = await res.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Unexpected API response:", data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Handle role change
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        throw new Error("Failed to update role");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, accountRole: newRole } : user
        )
      );

      console.log(`Role of user ${id} updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 p-6 rounded-s rounded-e shadow-md border border-gray-700"
    >
      <h3 className="text-lg font-semibold text-white mb-4">All Users</h3>

      {isLoading ? (
        <p className="text-gray-400">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-black">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-2 text-sm text-white flex gap-2 items-center"><img className="w-8 rounded-full aspect-square object-cover" src={user.avatar? user.avatar: "/default-avatar.jpg"}/>{user.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-400 capitalize">
                      <select
                        value={user.accountRole}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="p-1 border border-gray-700 rounded bg-black text-white text-sm"
                      >
                        {["member", "admin", "recruiter", "tpo"].map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default UserSettings;
