import React, { ChangeEvent } from "react";
import useResumeStore from "../../../store/useResumeStore";

const PersonalInfo = () => {
  const {
    personalInfo,
    updatePersonalInfo,
  } = useResumeStore();

  // Define a reusable handler for input changes
  const handleChange = (
    field: keyof typeof personalInfo,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updatePersonalInfo(field, e.target.value);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <span className="w-2 h-2 bg-[#79e708] rounded-full mr-3"></span>
        Personal Information
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={personalInfo.fullName}
          onChange={(e) => handleChange("fullName", e)}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-600"
        />
        <input
          type="email"
          placeholder="Email"
          value={personalInfo.email}
          onChange={(e) => handleChange("email", e)}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-600"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={personalInfo.phone}
          onChange={(e) => handleChange("phone", e)}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-600"
        />
        <input
          type="text"
          placeholder="Location"
          value={personalInfo.location}
          onChange={(e) => handleChange("location", e)}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-600"
        />
        <input
          type="url"
          placeholder="Website/Portfolio"
          value={personalInfo.website}
          onChange={(e) => handleChange("website", e)}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-600"
        />
        <textarea
          placeholder="Professional Summary"
          value={personalInfo.summary}
          onChange={(e) => handleChange("summary", e)}
          rows={4}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-600 resize-none"
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
