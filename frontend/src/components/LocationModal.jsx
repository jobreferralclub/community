import { motion } from "framer-motion"

// components/LocationModal
const LocationModal = ({ isOpen, onSelect }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 text-white"
        style={{
          boxShadow: "0 0 10px 2px #79b708"
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Select Job Location</h2>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('india')}
            className="p-6 border-2 rounded-xl flex flex-col items-center"
            style={{
              borderColor: "#79b708",
              boxShadow: "0 0 8px 2px #79b708"
            }}
          >
            <span className="text-3xl mb-2">🇮🇳</span>
            <span className="font-medium">India</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('us')}
            className="p-6 border-2 rounded-xl flex flex-col items-center"
            style={{
              borderColor: "#79b708",
              boxShadow: "0 0 8px 2px #79b708"
            }}
          >
            <span className="text-3xl mb-2">🇺🇸</span>
            <span className="font-medium">United States</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default LocationModal
