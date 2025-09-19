import React from "react";
import { Calendar, Building, MapPin } from "lucide-react";
import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";

// Helper to calculate duration
const calculateDuration = (start, end, currentlyWorking) => {
  const startDate = new Date(start);
  const endDate = currentlyWorking ? new Date() : new Date(end);

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (years === 0 && months === 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

  return parts.join(" ");
};

const WorkExperienceSection = ({ workExperience, onAdd, onEdit, onDelete }) => (
  <section className="bg-zinc-900 rounded-xl">
    <SectionHeader title="Work Experience" onAdd={onAdd} />
    <div className="space-y-4">
      {workExperience.map((work) => (
        <div
          key={work.id}
          className="group bg-zinc-800 rounded-s rounded-e p-4 hover:bg-gray-750 transition-colors relative"
        >
          {/* Edit/Delete buttons */}
          <div className="absolute top-4 right-4">
            <ActionButtons
              onEdit={() => onEdit(work)}
              onDelete={() => onDelete(work.id)}
            />
          </div>

          {/* Main Content */}
          <div className="pr-16">
            {/* Designation */}
            <h3 className="text-lg font-semibold text-lime-400 mb-1">
              {work.designation}
            </h3>

            {/* Profile (only for full-time) */}
            {work.workType === "fullTime" && (
              <p className="text-gray-400 text-sm mb-1">{work.profile}</p>
            )}

            {/* Organization */}
            <p className="text-gray-300 mb-1 flex items-center gap-1">
              <Building size={14} />
              {`${work.workType.slice(0, 1).toUpperCase() + work.workType.slice(1)} at ${work.organization
                }`}
            </p>

            {/* Location (show Remote if WFH) */}
            <p className="text-gray-400 text-sm mb-1 flex items-center gap-1">
              <MapPin size={14} />
              {work.isRemote ? "Remote" : work.location}
            </p>

            {/* Duration with experience time */}
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
              <Calendar size={14} />

              {work.startDate
                ? new Date(work.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
                : ""}

              {" - "}

              {work.currentlyWorking
                ? "Present"
                : work.endDate
                  ? new Date(work.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                  : ""}

              <span className="ml-2 text-gray-500">
                ({calculateDuration(work.startDate, work.endDate, work.currentlyWorking)})
              </span>
            </p>

            {/* Description */}
            {work.description && (
              <p className="text-gray-300 text-sm leading-relaxed">
                {work.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default WorkExperienceSection;
