import React from "react";
import { Calendar } from "lucide-react";
import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";

const ProjectsSection = ({ projects, onAdd, onEdit, onDelete }) => (
  <section className="bg-gray-900 rounded-xl p-6">
    <SectionHeader title="Projects" onAdd={onAdd} />
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors relative"
        >
          <div className="absolute top-4 right-4">
            <ActionButtons
              onEdit={() => onEdit(project)}
              onDelete={() => onDelete(project.id)}
            />
          </div>
          <div className="pr-16">
            <h3 className="text-lg font-semibold text-lime-400 mb-1">{project.title}</h3>
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
              <Calendar size={14} />
              {project.duration}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ProjectsSection;
