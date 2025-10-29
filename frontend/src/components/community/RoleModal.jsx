import { motion } from "framer-motion";

const RoleModal = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 max-w-lg w-full mx-4 text-white shadow-2xl border border-zinc-800"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            Welcome!
          </h2>
          <p className="text-zinc-400 text-sm">What best describes your role?</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('member')}
            className="group relative p-5 border-2 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-start gap-4 overflow-hidden transition-all duration-300"
            style={{ borderColor: "#79b708" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#79b708]/0 to-[#79b708]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-3xl">🎓</div>
            <div className="flex-1 text-left relative z-10">
              <div className="font-semibold text-lg mb-1">Club Member</div>
              <div className="text-zinc-400 text-sm">Looking for opportunities</div>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('tpo')}
            className="group relative p-5 border-2 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-start gap-4 overflow-hidden transition-all duration-300"
            style={{ borderColor: "#79b708" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#79b708]/0 to-[#79b708]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-3xl">👔</div>
            <div className="flex-1 text-left relative z-10">
              <div className="font-semibold text-lg mb-1">TPO</div>
              <div className="text-zinc-400 text-sm">Managing placements</div>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('recruiter')}
            className="group relative p-5 border-2 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-start gap-4 overflow-hidden transition-all duration-300"
            style={{ borderColor: "#79b708" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#79b708]/0 to-[#79b708]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-3xl">💼</div>
            <div className="flex-1 text-left relative z-10">
              <div className="font-semibold text-lg mb-1">Recruiter</div>
              <div className="text-zinc-400 text-sm">Looking for talent</div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleModal;