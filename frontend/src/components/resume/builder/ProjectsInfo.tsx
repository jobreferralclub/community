import React, { ChangeEvent } from "react";
import useResumeStore from "../../../store/useResumeStore";
import { Plus, X } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string;
  url: string;
};

const ProjectsInfo = () => {
  const { projects, addProject, updateProject, removeProject } = useResumeStore();

  const handleChange = (
    id: string,
    field: keyof Project,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updateProject(id, field, e.target.value);
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="Empty Projects"
          className="w-40 h-40 mb-6 opacity-70"
        />
        <h2 className="text-2xl font-semibold text-white mb-2">No Projects Added</h2>
        <p className="text-gray-400 max-w-md mb-6 text-sm">
          Showcasing your projects gives employers insight into your practical skills, creativity, and experience. Start by adding your best work!
        </p>
        <button
          onClick={() => addProject()}
          className="flex items-center gap-2 px-5 py-2 bg-[#79e708] text-black font-semibold rounded-lg hover:bg-[#6bc906] transition-colors duration-200 shadow-lg"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="w-2 h-2 bg-[#79e708] rounded-full mr-3"></span>
          Projects
        </h2>
        <button
          onClick={() => addProject()}
          className="flex items-center gap-2 px-4 py-2 bg-[#79e708] text-black font-medium rounded-lg hover:bg-[#6bc906] transition-colors duration-200 shadow-lg"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project: Project) => (
          <div
            key={project.id}
            className="border border-gray-700 rounded-lg p-4 relative bg-gray-800 hover:bg-gray-750 transition-colors duration-200"
          >
            <button
              onClick={() => removeProject(project.id)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full p-1 transition-colors duration-200"
            >
              <X size={16} />
            </button>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => handleChange(project.id, "name", e)}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500"
              />

              <textarea
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => handleChange(project.id, "description", e)}
                rows={3}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500 resize-none"
              />

              <input
                type="text"
                placeholder="Technologies Used"
                value={project.technologies}
                onChange={(e) => handleChange(project.id, "technologies", e)}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500"
              />

              <input
                type="url"
                placeholder="Project URL (optional)"
                value={project.url}
                onChange={(e) => handleChange(project.id, "url", e)}
                className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all duration-200 hover:border-gray-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsInfo;
