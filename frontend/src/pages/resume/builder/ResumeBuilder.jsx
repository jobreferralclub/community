import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Linkedin, FilePlus } from "lucide-react";
import { motion } from "framer-motion";
import Navigation from "../../../components/landing/Navigation";

const ResumeBuilder = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleOptionClick = (option) => {
    if (option === "enhance") navigate("/ai-resume-builder/enhancer");
    else if (option === "linkedin") navigate("/ai-resume-builder/resume-from-linkedin");
    else navigate("/resume-builder/questionnaire");
  };

  return (
    <>
      <Navigation />
      <div className="h-screen bg-black text-white relative overflow-hidden font-sans">
        {/* Grid Background & Radial Glow */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle,_rgba(121,231,8,0.15)_1px,_transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 z-0 bg-gradient-radial from-[#79e708]/15 to-transparent" />

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 text-center">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#79e708] to-[#5bc406] bg-clip-text text-transparent mb-2">
              JobReferral.Club
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
              AI Resume Builder
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-xl mx-auto">
              Whether you're starting from scratch, importing from LinkedIn, or
              enhancing an old resume — we've got you covered with AI-powered tools.
            </p>

            {/* CTA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-4xl">
              <OptionCard
                title="Enhance Existing Resume"
                icon={<Sparkles className="text-[#79e708] w-6 h-6" />}
                description="Give your old resume a fresh, AI-powered makeover."
                onClick={() => handleOptionClick("enhance")}
              />
              <OptionCard
                title="Import from LinkedIn"
                icon={<Linkedin className="text-[#79e708] w-6 h-6" />}
                description="Auto-fill your resume using your LinkedIn profile."
                onClick={() => handleOptionClick("linkedin")}
              />
              <OptionCard
                title="Start from Scratch"
                icon={<FilePlus className="text-[#79e708] w-6 h-6" />}
                description="Build a professional resume step-by-step with AI."
                onClick={() => handleOptionClick("scratch")}
              />
            </div>
          </motion.div>
        </div>

        {/* Extra CSS */}
        <style>
          {`
          .bg-gradient-radial {
            background: radial-gradient(circle at 50% 50%, var(--tw-gradient-stops));
          }
        `}
        </style>
      </div>
    </>
  );
};

const OptionCard = ({ title, description, icon, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-[#79e708] transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-300">{description}</p>
    </motion.div>
  );
};

export default ResumeBuilder;
