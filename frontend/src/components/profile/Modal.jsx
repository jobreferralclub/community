import React from "react";
import { X, Check } from "lucide-react";

const Modal = ({ show, title, onClose, onSave, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {children}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-lime-500 hover:bg-lime-400 text-black font-medium rounded-lg transition-colors"
          >
            <Check size={16} />
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
