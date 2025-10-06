import { motion } from "framer-motion"

// components/StatusModal
const StatusModal = ({ isOpen, onSelect }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 rounded-xl p-8 max-w-md w-full mx-4 text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Which of these best describes your current professional status?
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('students_freshers')}
            className="p-4 border-2 rounded-xl bg-zinc-900 flex items-center justify-center hover:shadow-lg hover:shadow-[#79b708] transition-shadow"
            style={{ borderColor: "#79b708" }}
          >
            <span className="font-medium">Students & Freshers</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('working_professionals')}
            className="p-4 border-2 rounded-xl bg-zinc-900 flex items-center justify-center hover:shadow-lg hover:shadow-[#79b708] transition-shadow"
            style={{ borderColor: "#79b708" }}
          >
            <span className="font-medium">Working Professionals</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('career_switchers')}
            className="p-4 border-2 rounded-xl bg-zinc-900 flex items-center justify-center hover:shadow-lg hover:shadow-[#79b708] transition-shadow"
            style={{ borderColor: "#79b708" }}
          >
            <span className="font-medium">Career Switchers</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('hr_professionals')}
            className="p-4 border-2 rounded-xl bg-zinc-900 flex items-center justify-center hover:shadow-lg hover:shadow-[#79b708] transition-shadow"
            style={{ borderColor: "#79b708" }}
          >
            <span className="font-medium">HR Professionals</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('remote_job_seekers')}
            className="p-4 border-2 rounded-xl bg-zinc-900 flex items-center justify-center hover:shadow-lg hover:shadow-[#79b708] transition-shadow"
            style={{ borderColor: "#79b708" }}
          >
            <span className="font-medium">Remote Job Seekers</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default StatusModal
