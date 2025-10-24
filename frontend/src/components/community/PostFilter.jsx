import React from "react";
import * as FiIcons from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
const { FiSearch, FiDownload } = FiIcons;

const experienceLevels = [
  { value: "intern", label: "Intern" },
  { value: "entry", label: "Freshers" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" }
];
const jobTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "internship", label: "Internship" }
];
const salaryRanges = [
  { label: "₹0–₹4L", min: 0, max: 400000 },
  { label: "₹4L–₹10L", min: 400000, max: 1000000 },
  { label: "₹10L+", min: 1000000, max: null }
];

const API_BASE_URL = import.meta.env.VITE_API_PORT;

export default function PostFilter({
  selectedFilters,
  setSelectedFilters,
  onSearch,
}) {
  // Get the user role from auth store
  const role = useAuthStore((state) => state.role);

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

  async function handleDownload() {
    try {
      const params = new URLSearchParams();
      if (selectedFilters.salaryRange)
        params.append("salaryLabel", selectedFilters.salaryRange);

      // You can append other filters here similarly if needed

      const resp = await fetch(`${API_BASE_URL}/api/posts?${params.toString()}`);
      const payload = await resp.json();
      if (!payload.posts) return;

      const csvHeaders = [
        "Company Name",
        "Location",
        "Salary Min",
        "Salary Max",
        "Job Type",
        "Experience Level",
        "Job Title",
        "Job Description"
      ];

      const csvRows = [
        csvHeaders.join(","),
        ...payload.posts.map(post =>
          [
            `"${post.companyName || ""}"`,
            `"${post.location || ""}"`,
            post.salaryMin || "",
            post.salaryMax || "",
            `"${post.jobType || ""}"`,
            `"${post.experienceLevel || ""}"`,
            `"${post.jobTitle || ""}"`,
            `"${(post.job_description || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`
          ].join(",")
        )
      ];

      const csvContent = csvRows.join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "filtered_posts.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
      console.error(err);
    }
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
        placeholder="Keyword"
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
        {experienceLevels.map(lvl => (
          <option key={lvl.value} value={lvl.value} className="text-gray-300 bg-gray-800">
            {lvl.label}
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
        {jobTypes.map(type => (
          <option key={type.value} value={type.value} className="text-gray-300 bg-gray-800">
            {type.label}
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
      <div style={{ display: "flex", alignItems: "center" }}>
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
        {role === "tpo" && (
          <button
            type="button"
            onClick={handleDownload}
            className="ml-2 px-2 py-2 rounded-xl flex items-center justify-center border border-[#4d6a4d] bg-[#2c3c2d] hover:bg-[#3b5c41] text-[#c5f07a] shadow"
            title="Download matching posts"
            aria-label="Download matching posts"
            style={{ minWidth: 0 }}
          >
            <FiDownload className="w-5 h-5" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="
          p-2 rounded-xl flex items-center justify-center 
          bg-gradient-to-br from-[#486a56] via-[#5a8452] to-[#3b5c41]
          border border-[#4d6a4d]
          shadow-[0_0_8px_2px_rgba(121,231,8,0.4)]
          hover:shadow-[0_0_12px_4px_rgba(121,231,8,0.6)]
          backdrop-blur-md
          transition-all duration-200 ease-in-out
          hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-[#79e708]
        "
        title="Search"
        aria-label="Search"
      >
        <FiSearch className="w-5 h-5 text-[#d4f38f]" />
      </button>
    </form>
  );
}
