import React, { useState } from "react";

const experienceLevels = [
  "intern", "entry", "mid", "senior", "director"
];
const jobTypes = [
  "full-time", "part-time", "contract", "internship", "freelance"
];
const salaryRanges = [
  { label: "₹0–₹5L", min: 0, max: 500000 },
  { label: "₹5L–₹10L", min: 500000, max: 1000000 },
  { label: "₹10L–₹20L", min: 1000000, max: 2000000 },
  { label: "₹20L+", min: 2000000, max: null },
];

export default function PostFilter({ selectedFilters, setSelectedFilters, onSearch }) {
  function handleChange(e) {
    setSelectedFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSalaryChange(e) {
    setSelectedFilters(prev => ({ ...prev, salaryRange: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSearch();
  }

  return (
    // Container updated for more padding and spacing
<form 
  className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-zinc-900/90 rounded-2xl shadow-lg"
  onSubmit={handleSubmit}
>
  <input
    name="keyword"
    value={selectedFilters.keyword || ""}
    onChange={handleChange}
    placeholder="Job Title/ Keyword"
    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#79e708] transition-shadow"
  />
  <input
    name="location"
    value={selectedFilters.location || ""}
    onChange={handleChange}
    placeholder="Location"
    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#79e708] transition-shadow"
  />
  <select
    name="experienceLevel"
    value={selectedFilters.experienceLevel || ""}
    onChange={handleChange}
    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#79e708] transition-shadow"
  >
    <option value="">Experience Level</option>
    {experienceLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
  </select>
  <select
    name="jobType"
    value={selectedFilters.jobType || ""}
    onChange={handleChange}
    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#79e708] transition-shadow"
  >
    <option value="">Job Type</option>
    {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
  </select>
  <input
    name="companyName"
    value={selectedFilters.companyName || ""}
    onChange={handleChange}
    placeholder="Company Name"
    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#79e708] transition-shadow"
  />
  <select
    name="salaryRange"
    value={selectedFilters.salaryRange || ""}
    onChange={handleSalaryChange}
    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#79e708] transition-shadow"
  >
    <option value="">Salary Range</option>
    {salaryRanges.map(sr => <option key={sr.label} value={sr.label}>{sr.label}</option>)}
  </select>
  <button
    type="submit"
    className="col-span-2 md:col-span-1 px-4 py-3 bg-[#79e708] text-black rounded-lg font-semibold hover:brightness-105 hover:shadow-lg transition-all"
  >
    Search
  </button>
</form>

  );
}
