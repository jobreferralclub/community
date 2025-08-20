import React from "react";
import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";

const SkillsSection = ({ skills, onAdd, onEdit, onDelete }) => (
  <section className="bg-gray-900 rounded-xl p-6">
    <SectionHeader title="Skills" onAdd={onAdd} />
    <div className="space-y-4">
      {skills.map((skill) => (
        <div key={skill.id} className="group relative">
          <div className="absolute top-0 right-0">
            <ActionButtons
              onEdit={() => onEdit(skill)}
              onDelete={() => onDelete(skill.id)}
            />
          </div>
          <div className="pr-16">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{skill.name}</span>
              <span className="text-lime-400 font-medium">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-lime-400 to-lime-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default SkillsSection;
