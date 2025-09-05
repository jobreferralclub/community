import React, { ChangeEvent, useEffect } from "react";
import useResumeStore from "../../../store/useResumeStore";
import { Plus, X } from "lucide-react";

interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ExperienceInfoProps {
  data?: {
    work?: {
      organization?: string;
      designation?: string;
      startDate?: string;
      endDate?: string;
      currentlyWorking?: boolean;
      description?: string;
      location?: string;
      workType?: string;
      isRemote?: boolean;
    }[];
  };
}

const ExperienceInfo: React.FC<ExperienceInfoProps> = ({ data }) => {
  const { experience, addExperience, updateExperience, removeExperience } =
    useResumeStore();

  // ✅ Prefill from builder preview (auth store)
  useEffect(() => {
    if (data?.work && data.work.length > 0 && experience.length === 0) {
      const mappedExperiences = data.work.map((job, idx) => ({
        id: `exp-${idx}`, // unique id
        company: job.organization || "",
        position: job.designation || "",
        startDate: job.startDate ? job.startDate.split("T")[0] : "",
        endDate: job.endDate ? job.endDate.split("T")[0] : "",
        current: !!job.currentlyWorking,
        description: job.description || "",
      }));

      // ✅ Replace the whole experience array in Zustand
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
        <div className="flex gap-4">
          <button
            onClick={() => addExperience()}
            className="flex items-center gap-2 px-5 py-2 bg-[#79e708] text-black font-semibold rounded-lg hover:bg-[#6bc906] transition-colors duration-200 shadow-lg"
          >
            <Plus size={16} />
            Add Experience
          </button>
        </div>
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
            className="border border-gray-700 rounded-lg p-4 relative bg-gray-800 hover:bg-gray-750 transition-colors duration-200"
          >
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full p-1 transition-colors duration-200"
            >
              <X size={16} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) =>
                  handleChange(exp.id, "company", e.target.value)
                }
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500"
              />
              <input
                type="text"
                placeholder="Position"
                value={exp.position}
                onChange={(e) =>
                  handleChange(exp.id, "position", e.target.value)
                }
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={exp.startDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  handleChange(exp.id, "startDate", e.target.value)
                }
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) =>
                    handleChange(exp.id, "endDate", e.target.value)
                  }
                  disabled={exp.current}
                  className="flex-1 px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500 disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-500"
                />
                <label className="flex items-center gap-2 text-sm text-gray-300 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) =>
                      handleChange(exp.id, "current", e.target.checked)
                    }
                    className="w-4 h-4 text-[#79e708] bg-black border-gray-600 rounded focus:ring-[#79e708] focus:ring-2"
                  />
                  Current
                </label>
              </div>
            </div>
            <textarea
              placeholder="Job Description"
              value={exp.description}
              onChange={(e) =>
                handleChange(exp.id, "description", e.target.value)
              }
              rows={3}
              className="w-full mt-3 px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500 resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceInfo;
