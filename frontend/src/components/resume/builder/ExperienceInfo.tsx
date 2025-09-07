import React, { useEffect } from "react";
import useResumeStore from "../../../store/useResumeStore";
import { Plus, X } from "lucide-react";

interface ExperienceEntry {
  id: string;
  workType: string;
  designation: string;
  profile: string;
  organization: string;
  location: string;
  isRemote: boolean;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

interface ExperienceInfoProps {
  data?: {
    work?: {
      workType?: string;
      designation?: string;
      profile?: string;
      organization?: string;
      location?: string;
      isRemote?: boolean;
      startDate?: string;
      endDate?: string;
      currentlyWorking?: boolean;
      description?: string;
    }[];
  };
}

const ExperienceInfo: React.FC<ExperienceInfoProps> = ({ data }) => {
  const { experience, addExperience, updateExperience, removeExperience } =
    useResumeStore();

  // ✅ Prefill from props → Zustand
  useEffect(() => {
    if (data?.work && data.work.length > 0 && experience.length === 0) {
      const mappedExperiences: ExperienceEntry[] = data.work.map((job, idx) => ({
        id: `exp-${idx}`,
        workType: job.workType ?? "fullTime",
        designation: job.designation ?? "",
        profile: job.profile ?? "",
        organization: job.organization ?? "",
        location: job.location ?? "",
        isRemote: job.isRemote ?? false,
        startDate: job.startDate ? job.startDate.split("T")[0] : "",
        endDate: job.endDate ? job.endDate.split("T")[0] : "",
        currentlyWorking: !!job.currentlyWorking,
        description: job.description ?? "",
      }));

      useResumeStore.setState({ experience: mappedExperiences });
    }
  }, [data, experience.length]);

  const handleChange = (
    id: string,
    field: keyof ExperienceEntry,
    value: string | boolean
  ) => {
    updateExperience(id, field, value);
  };

  if (experience.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="Empty Experience"
          className="w-40 h-40 mb-6 opacity-70"
        />
        <h2 className="text-2xl font-semibold text-white mb-2">
          No Experience Added
        </h2>
        <p className="text-gray-400 max-w-md mb-6 text-sm">
          Adding your work experience helps employers understand your skills and
          background. It’s a key part of making your resume stand out.
        </p>
        <button
          onClick={() => addExperience()}
          className="flex items-center gap-2 px-5 py-2 bg-[#79e708] text-black font-semibold rounded-lg hover:bg-[#6bc906] transition-colors duration-200 shadow-lg"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="w-2 h-2 bg-[#79e708] rounded-full mr-3"></span>
          Experience
        </h2>
        <button
          onClick={() => addExperience()}
          className="flex items-center gap-2 px-4 py-2 bg-[#79e708] text-black font-medium rounded-lg hover:bg-[#6bc906] transition-colors duration-200 shadow-lg"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((exp: ExperienceEntry) => (
          <div
            key={exp.id}
            className="border border-gray-700 rounded-lg p-4 relative bg-gray-800 hover:bg-gray-750 transition-colors"
          >
            {/* Remove */}
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full p-1"
            >
              <X size={16} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Organization */}
              <input
                type="text"
                placeholder="Organization"
                value={exp.organization}
                onChange={(e) =>
                  handleChange(exp.id, "organization", e.target.value)
                }
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white"
              />

              {/* Designation */}
              <input
                type="text"
                placeholder="Designation"
                value={exp.designation}
                onChange={(e) =>
                  handleChange(exp.id, "designation", e.target.value)
                }
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white"
              />

              {/* Work Type */}
              <select
                value={exp.workType}
                onChange={(e) =>
                  handleChange(exp.id, "workType", e.target.value)
                }
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white"
              >
                <option value="fullTime">Full Time</option>
                <option value="partTime">Part Time</option>
                <option value="internship">Internship</option>
                <option value="volunteering">Volunteering</option>
              </select>

              {/* Profile (optional for fullTime) */}
              <input
                type="text"
                placeholder="Profile"
                value={exp.profile}
                onChange={(e) =>
                  handleChange(exp.id, "profile", e.target.value)
                }
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white"
              />

              {/* Location */}
              <input
                type="text"
                placeholder="Location"
                value={exp.location}
                onChange={(e) =>
                  handleChange(exp.id, "location", e.target.value)
                }
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white"
              />

              {/* Remote Checkbox */}
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={exp.isRemote}
                  onChange={(e) =>
                    handleChange(exp.id, "isRemote", e.target.checked)
                  }
                  className="w-4 h-4 text-[#79e708] bg-black border-gray-600 rounded"
                />
                Remote
              </label>

              {/* Dates */}
              <input
                type="date"
                value={exp.startDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  handleChange(exp.id, "startDate", e.target.value)
                }
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white"
              />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={exp.endDate}
                  disabled={exp.currentlyWorking}
                  onChange={(e) =>
                    handleChange(exp.id, "endDate", e.target.value)
                  }
                  className="flex-1 px-4 py-3 bg-black border border-gray-600 rounded-lg text-white disabled:bg-gray-800"
                />
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) =>
                      handleChange(exp.id, "currentlyWorking", e.target.checked)
                    }
                    className="w-4 h-4 text-[#79e708] bg-black border-gray-600 rounded"
                  />
                  Current
                </label>
              </div>
            </div>

            {/* Description */}
            <textarea
              placeholder="Job Description"
              value={exp.description}
              onChange={(e) =>
                handleChange(exp.id, "description", e.target.value)
              }
              rows={3}
              className="w-full mt-3 px-4 py-3 bg-black border border-gray-600 rounded-lg text-white resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceInfo;
