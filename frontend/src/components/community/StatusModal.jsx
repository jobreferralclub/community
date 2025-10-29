import { motion } from "framer-motion"

const StatusModal = ({ isOpen, onSelect }) => {
  if (!isOpen) return null

  const options = [
    {
      id: 'students_freshers',
      icon: '🎓',
      title: 'Students & Freshers',
      description: 'Starting your career journey'
    },
    {
      id: 'working_professionals',
      icon: '💼',
      title: 'Working Professionals',
      description: 'Growing in your current field'
    },
    {
      id: 'career_switchers',
      icon: '🔄',
      title: 'Career Switchers',
      description: 'Transitioning to a new path'
    },
    {
      id: 'hr_professionals',
      icon: '👥',
      title: 'HR Professionals',
      description: 'Managing talent & recruitment'
    },
    {
      id: 'remote_job_seekers',
      icon: '🌍',
      title: 'Remote Job Seekers',
      description: 'Seeking location-independent work'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 max-w-2xl w-full text-white shadow-2xl border border-zinc-800 max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            Tell us about yourself
          </h2>
          <p className="text-zinc-400 text-sm">
            Which best describes your current professional status?
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.slice(0, 4).map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option.id)}
              className="group relative p-5 border-2 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-start gap-4 overflow-hidden transition-all duration-300 text-left"
              style={{ borderColor: "#79b708" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#79b708]/0 to-[#79b708]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-3xl flex-shrink-0">{option.icon}</div>
              <div className="flex-1 relative z-10">
                <div className="font-semibold text-base mb-1">{option.title}</div>
                <div className="text-zinc-400 text-xs">{option.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
        
        <div className="mt-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(options[4].id)}
            className="group relative p-5 border-2 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-start gap-4 overflow-hidden transition-all duration-300 text-left w-full md:w-1/2"
            style={{ borderColor: "#79b708" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#79b708]/0 to-[#79b708]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-3xl flex-shrink-0">{options[4].icon}</div>
            <div className="flex-1 relative z-10">
              <div className="font-semibold text-base mb-1">{options[4].title}</div>
              <div className="text-zinc-400 text-xs">{options[4].description}</div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default StatusModal