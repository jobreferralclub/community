import { motion } from "framer-motion";

const RoleModal = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 rounded-xl p-8 max-w-md w-full mx-4 text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          What is your role?
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('member')}
            className="p-4 border-2 rounded-xl bg-zinc-900 flex items-center justify-center hover:shadow-lg hover:shadow-[#79b708] transition-shadow"
            style={{ borderColor: "#79b708" }}
          >
            <span className="font-medium">Member</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('tpo')}
            className="p-4 border-2 rounded-xl bg-zinc-900 flex items-center justify-center hover:shadow-lg hover:shadow-[#79b708] transition-shadow"
            style={{ borderColor: "#79b708" }}
          >
            <span className="font-medium">TPO</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('recruiter')}
            className="p-4 border-2 rounded-xl bg-zinc-900 flex items-center justify-center hover:shadow-lg hover:shadow-[#79b708] transition-shadow"
            style={{ borderColor: "#79b708" }}
          >
            <span className="font-medium">Recruiter</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleModal;
