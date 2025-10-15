import React from "react";
import * as FiIcons from "react-icons/fi";
const { FiSearch } = FiIcons;

const experienceLevels = ["intern", "entry", "mid", "senior", "director"];
const jobTypes = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
];
const salaryRanges = [
  { label: "₹0–₹5L", min: 0, max: 500000 },
  { label: "₹5L–₹10L", min: 500000, max: 1000000 },
  { label: "₹10L–₹20L", min: 1000000, max: 2000000 },
  { label: "₹20L+", min: 2000000, max: null },
];

export default function PostFilter({
  selectedFilters,
  setSelectedFilters,
  onSearch,
}) {
  function handleChange(e) {
    setSelectedFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSalaryChange(e) {
    setSelectedFilters((prev) => ({ ...prev, salaryRange: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSearch();
  }

  return (
    <form
      className="flex flex-wrap md:flex-nowrap items-center gap-2 p-2 bg-zinc-900 rounded-xl shadow"
      onSubmit={handleSubmit}
    >
      <input
        name="keyword"
        value={selectedFilters.keyword || ""}
        onChange={handleChange}
        placeholder="Job Title / Keyword"
        className="flex-1 min-w-[110px] px-2 py-2 rounded-xl bg-gray-800 text-gray-300 border border-gray-700 focus:ring-[#79e708]"
      />
      <input
        name="location"
        value={selectedFilters.location || ""}
        onChange={handleChange}
        placeholder="Location"
        className="flex-1 min-w-[90px] px-2 py-2 rounded-xl bg-gray-800 text-gray-300 border border-gray-700 focus:ring-[#79e708]"
      />
      <select
        name="experienceLevel"
        value={selectedFilters.experienceLevel || ""}
        onChange={handleChange}
        className="min-w-[100px] px-2 py-2 rounded-xl bg-gray-800 text-gray-300 border border-gray-700 focus:ring-[#79e708]"
      >
        <option className="text-gray-300 bg-gray-800" value="">
          Experience Level
        </option>
        {experienceLevels.map((lvl) => (
          <option key={lvl} value={lvl} className="text-gray-300 bg-gray-800">
            {lvl}
          </option>
        ))}
      </select>
      <select
        name="jobType"
        value={selectedFilters.jobType || ""}
        onChange={handleChange}
        className="min-w-[100px] px-2 py-2 rounded-xl bg-gray-800 text-gray-300 border border-gray-700 focus:ring-[#79e708]"
      >
        <option className="text-gray-300 bg-gray-800" value="">
          Job Type
        </option>
        {jobTypes.map((type) => (
          <option key={type} value={type} className="text-gray-300 bg-gray-800">
            {type}
          </option>
        ))}
      </select>
      <input
        name="companyName"
        value={selectedFilters.companyName || ""}
        onChange={handleChange}
        placeholder="Company Name"
        className="flex-1 min-w-[110px] px-2 py-2 rounded-xl bg-gray-800 text-gray-300 border border-gray-700 focus:ring-[#79e708]"
      />
      <select
        name="salaryRange"
        value={selectedFilters.salaryRange || ""}
        onChange={handleSalaryChange}
        className="min-w-[100px] px-2 py-2 rounded-xl bg-gray-800 text-gray-300 border border-gray-700 focus:ring-[#79e708]"
      >
        <option className="text-gray-300 bg-gray-800" value="">
          Salary Range
        </option>
        {salaryRanges.map((sr) => (
          <option
            key={sr.label}
            value={sr.label}
            className="text-gray-300 bg-gray-800"
          >
            {sr.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-[#79e708] p-2 rounded-full flex items-center justify-center border-2 border-[#5da106] shadow-md hover:brightness-110 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#5da106] transition-all duration-150"
        title="Search"
        aria-label="Search"
      >
        <FiSearch className="w-5 h-5 text-black" />
      </button>
    </form>
  );
}
