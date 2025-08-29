// CompanySettings.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CompanySettings = () => {
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCompany, setNewCompany] = useState({ name: "", domain: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch companies on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/companies`); // <-- Adjust API endpoint
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
      }
    };
    loadCompanies();
  }, []);

  // Add new company
  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.domain) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany),
      });
      const added = await res.json();
      setCompanies([...companies, added]);
      setNewCompany({ name: "", domain: "" });
    } catch (err) {
      console.error("Failed to add company:", err);
    }
    setIsSubmitting(false);
  };

  // Delete company
  const handleDeleteCompany = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_PORT}/api/companies/${id}`, { method: "DELETE" });
      setCompanies(companies.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete company:", err);
    }
  };

  // Filter companies by search
  const filteredCompanies = companies.filter(
    (company) =>
      company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.domain?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Form to Add Company */}
      <div className="bg-zinc-900 p-6 rounded-xl shadow-md border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Add New Company</h3>
        <form
          onSubmit={handleAddCompany}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Company Name"
            className="p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400"
            value={newCompany.name}
            onChange={(e) =>
              setNewCompany({ ...newCompany, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Company Domain (e.g. example.com)"
            className="p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400"
            value={newCompany.domain}
            onChange={(e) =>
              setNewCompany({ ...newCompany, domain: e.target.value })
            }
          />
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Company"}
            </button>
          </div>
        </form>
      </div>

      {/* Search & List Companies */}
      <div className="bg-zinc-900 p-6 rounded-xl shadow-md border border-gray-700">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or domain..."
            className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">
          Registered Companies
        </h3>

        <div className="divide-y divide-gray-700">
          {filteredCompanies.length === 0 ? (
            <p className="text-gray-400">No companies registered yet.</p>
          ) : (
            filteredCompanies.map((company) => (
              <div
                key={company._id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-white">{company.name}</p>
                  <p className="text-sm text-gray-400">{company.domain}</p>
                </div>
                <button
                  onClick={() => handleDeleteCompany(company._id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CompanySettings;
