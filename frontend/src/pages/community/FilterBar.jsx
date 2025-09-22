import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

// You can edit the FILTERS array to include any filter you want
const FILTERS = [
  {
    id: "jobs",
    type: "dropdown",
    label: "Job Roles",
    options: [
      "Software Engineer",
      "Data Analyst",
      "Project Manager",
      "Product Manager",
      "Marketing Manager",
      "Sales Executive",
      "Category Manager",
      "Financial Analyst",
      "HR Executive",
      "Business Consultant",
    ],
  },
  {
    id: "datePosted",
    type: "dropdown",
    label: "Date posted",
    options: ["Any time", "Past 24 hours", "Past week", "Past month"],
  },
  {
    id: "company",
    type: "dropdown",
    label: "Company",
    options: ["Any", "Google", "Microsoft", "Amazon"],
  },
  // Uncomment if pills needed
  // {
  //   id: "easyApply",
  //   type: "pill",
  //   label: "Easy Apply",
  // },
  // {
  //   id: "under10",
  //   type: "pill",
  //   label: "Under 10 applicants",
  // },
];

const FilterBar = ({ selectedFilters, setSelectedFilters }) => {
  const [dropdownOpen, setDropdownOpen] = useState({});

  const handlePillClick = (id) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDropdownSelect = (id, option) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [id]: option,
    }));
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-wrap gap-3 items-center mt-6 mb-6">
      {FILTERS.map((filter) =>
        filter.type === "pill" ? (
          <button
            key={filter.id}
            className={`px-5 py-2 rounded-full font-semibold transition-colors
              ${
                selectedFilters[filter.id]
                  ? "bg-zinc-700 text-gray-100 shadow"
                  : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
              }`}
            onClick={() => handlePillClick(filter.id)}
          >
            {filter.label}
          </button>
        ) : (
          <div key={filter.id} className="relative">
            <button
              className={`flex items-center px-5 py-2 rounded-full font-semibold transition-colors
                ${
                  dropdownOpen[filter.id]
                    ? "bg-zinc-700 text-gray-100 shadow"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              onClick={() => toggleDropdown(filter.id)}
            >
              {filter.label}
              <FiChevronDown className="ml-2" />
            </button>
            {dropdownOpen[filter.id] && (
              <div className="absolute left-0 mt-2 min-w-[150px] bg-zinc-900 rounded-lg shadow-lg z-20">
                {filter.options.map((option) => (
                  <button
                    key={option}
                    className={`w-full text-left px-4 py-2 rounded font-medium text-gray-300 hover:bg-zinc-700
                      ${
                        selectedFilters[filter.id] === option
                          ? "bg-zinc-700 text-gray-100"
                          : ""
                      }`}
                    onClick={() => handleDropdownSelect(filter.id, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default FilterBar;
