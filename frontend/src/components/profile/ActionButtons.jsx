import React from "react";
import { Edit3, Trash2 } from "lucide-react";

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <button
      onClick={onEdit}
      className="p-2 text-lime-400 hover:text-lime-300 transition-colors"
    >
      <Edit3 size={16} />
    </button>
    <button
      onClick={onDelete}
      className="p-2 text-red-400 hover:text-red-300 transition-colors"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

export default ActionButtons;
