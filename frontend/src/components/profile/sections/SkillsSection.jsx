import React from "react";
import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";

const SkillsSection = ({ skills, onAdd, onDelete }) => (
  <section className="bg-zinc-900 rounded-xl">
    <SectionHeader title="Skills" onAdd={onAdd} />

    <div className="flex flex-wrap gap-3 mt-4">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="group relative bg-zinc-800 rounded-s rounded-e px-4 py-2 flex items-center hover:bg-gray-700 transition-colors"
        >
          {/* Skill name */}
          <span className="text-white font-medium">{skill.name}</span>

          {/* Delete button on hover (top-right) */}
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ActionButtons
              onDelete={() => onDelete(skill.id)}
              showEdit={false} // ensure edit is hidden
            />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default SkillsSection;
