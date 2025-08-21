import React from "react";
import { Calendar, ExternalLink } from "lucide-react";
import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";

const formatMonthYear = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const ProjectsSection = ({ projects, onAdd, onEdit, onDelete }) => (
  <section className="bg-gray-900 rounded-xl p-6">
    <SectionHeader title="Projects" onAdd={onAdd} />
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors relative"
        >
          {/* Action Buttons */}
          <div className="absolute top-4 right-4">
            <ActionButtons
              onEdit={() => onEdit(project)}
              onDelete={() => onDelete(project.id)}
            />
          </div>

          <div className="pr-16">
            {/* Project Title */}
            <h3 className="text-lg font-semibold text-lime-400 mb-1">
              {project.title}
            </h3>

            {/* Dates */}
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
              <Calendar size={14} />
              {project.startMonth ? formatMonthYear(project.startMonth) : ""}
              {" - "}
              {project.currentlyOngoing
                ? "Present"
                : project.endMonth
                  ? formatMonthYear(project.endMonth)
                  : ""}
            </p>

            {/* Description (optional) */}
            {project.description && (
              <p className="text-gray-300 text-sm leading-relaxed mb-2">
                {project.description}
              </p>
            )}

            {/* Project Link (optional) */}
            {project.projectLink && (() => {
              try {
                const url = new URL(project.projectLink, window.location.origin);
                // Only allow http/https
                if (url.protocol === "http:" || url.protocol === "https:") {
                  return (
                    <a
                      href={url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-400 hover:underline"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      View Project
                    </a>
                  );
                }
              } catch {
                // invalid URL → don’t render
                return null;
              }
            })()}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ProjectsSection;
