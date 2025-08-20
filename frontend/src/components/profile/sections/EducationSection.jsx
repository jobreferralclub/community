import React from "react";
import { Calendar, Award, GraduationCap, BookOpen } from "lucide-react";
import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";

const EducationSection = ({ education, onAdd, onEdit, onDelete }) => (
  <section className="bg-gray-900 rounded-xl p-6">
    <SectionHeader title="Education" onAdd={onAdd} />
    <div className="space-y-4">
      {education.map((edu) => (
        <div
          key={edu._id}
          className="group bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors relative"
        >
          {/* Edit/Delete buttons */}
          <div className="absolute top-4 right-4">
            <ActionButtons
              onEdit={() => onEdit(edu)}
              onDelete={() => onDelete(edu.id)}
            />
          </div>

          {/* Education Info */}
          <div className="pr-16">
            {/* Level */}
            <h3 className="text-lg font-semibold text-lime-400 mb-1 flex items-center gap-2">
              <GraduationCap size={16} />
              {(() => {
                switch (edu.level) {
                  case "secondary":
                    return "Secondary (X)";
                  case "seniorSecondary":
                    return "Senior Secondary (XII)";
                  case "graduation":
                    return "Graduation";
                  case "diploma":
                    return "Diploma";
                  case "phd":
                    return "PhD";
                  default:
                    return "";
                }
              })()}
            </h3>

            {/* Institution */}
            <p className="text-gray-300 mb-2">{edu.institution}</p>

            {/* Board / Degree / Stream */}
            <div className="text-gray-400 text-sm space-y-1 mb-2">
              {edu.board && <p>Board: {edu.board}</p>}
              {edu.degree && <p>Degree: {edu.degree}</p>}
              {edu.stream && <p>Stream: {edu.stream}</p>}
            </div>

            {/* Years & Performance */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              {/* Duration */}
              {(edu.startYear || edu.endYear) && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {edu.startYear} – {edu.endYear}
                </span>
              )}

              {/* Score */}
              {edu.performance && (
                <span className="flex items-center gap-1">
                  <Award size={14} />
                  {edu.performance} {edu.scoreType}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default EducationSection;
