import React from "react";
import { Plus } from "lucide-react";

const SectionHeader = ({ title, onAdd }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-400 text-black font-medium rounded-lg transition-colors"
    >
      <Plus size={16} />
      Add New
    </button>
  </div>
);

export default SectionHeader;
