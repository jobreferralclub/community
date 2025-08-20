import React, { ChangeEvent } from "react";
import { Plus, X } from "lucide-react";
import useResumeStore from "../../../store/useResumeStore";

const SkillsInfo: React.FC = () => {
  const { skills, addSkill, updateSkill, removeSkill } = useResumeStore();

  const handleChange = (
    id: string,
    field: "name" | "level",
    value: string
  ) => {
    updateSkill(id, field, value);
  };

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png"
          alt="Empty Skills"
          className="w-40 h-40 mb-6 opacity-70"
        />
        <h2 className="text-2xl font-semibold text-white mb-2">No Skills Added</h2>
        <p className="text-gray-400 max-w-md mb-6 text-sm">
          Highlighting your skills helps recruiters quickly understand your strengths and technical capabilities. Don't leave it blank!
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => addSkill()}
            className="flex items-center gap-2 px-5 py-2 bg-[#79e708] text-black font-semibold rounded-lg hover:bg-[#6bc906] transition-colors duration-200 shadow-lg"
          >
            <Plus size={16} />
            Add Skill
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
          Skills
        </h2>
        <button
          onClick={() => addSkill()}
          className="flex items-center gap-2 px-4 py-2 bg-[#79e708] text-black font-medium rounded-lg hover:bg-[#6bc906] transition-colors duration-200 shadow-lg"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="border border-gray-700 rounded-lg p-4 relative bg-gray-800 hover:bg-gray-750 transition-colors duration-200"
          >
            <button
              onClick={() => removeSkill(skill.id)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full p-1 transition-colors duration-200"
            >
              <X size={16} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Skill name"
                value={skill.name}
                onChange={(e) => handleChange(skill.id, "name", e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500"
              />
              <select
                value={skill.level}
                onChange={(e) => handleChange(skill.id, "level", e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsInfo;
