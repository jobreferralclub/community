import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Briefcase } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#79e708] rounded-full filter blur-[120px] opacity-20" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#79e708] rounded-full filter blur-[120px] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 p-8 max-w-lg relative z-10"
      >
        {/* Icon & Title */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            bounce: 0.4,
          }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(121, 231, 8, 0)",
                "0 0 20px 10px rgba(121, 231, 8, 0.3)",
                "0 0 0 0 rgba(121, 231, 8, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="rounded-full p-4 bg-black border-2 border-[#79e708]"
          >
            <Briefcase className="w-16 h-16 text-[#79e708]" />
          </motion.div>
          <h1 className="text-8xl font-black text-[#79e708] tracking-tighter">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Lost in the Referral Network
          </h2>
          <p className="text-gray-400 text-lg">
            Looks like this page doesn't exist on JobReferral Club.
            <br />
            Don't worry — there are still plenty of opportunities waiting for you!
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pt-4"
        >
          <Button
            asChild
            className="bg-[#79e708] hover:bg-[#5fb806] text-black font-semibold text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#79e708]/20"
          >
            <a href="/">Back to Dashboard</a>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;