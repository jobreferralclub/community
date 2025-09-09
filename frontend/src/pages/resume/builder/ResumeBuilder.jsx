import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Linkedin, FilePlus } from "lucide-react";
import { motion } from "framer-motion";
import Navigation from "../../../components/landing/Navigation";
import Footer from "../../../components/landing/Footer";

const ResumeBuilder = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleOptionClick = (option) => {
    if (option === "enhance") navigate("/resume-builder/enhancer");
    else if (option === "linkedin") navigate("/resume-builder/resume-from-linkedin");
    else navigate("/resume-builder/questionnaire");
  };

  const options = [
    {
      title: "Enhance Existing Resume",
      description: "Give your old resume a fresh, AI-powered makeover.",
      icon: <Sparkles className="text-[#79e708] w-7 h-7" />,
      action: "enhance",
    },
    {
      title: "Import from LinkedIn",
      description: "Auto-fill your resume using your LinkedIn profile.",
      icon: <Linkedin className="text-[#79e708] w-7 h-7" />,
      action: "linkedin",
    },
    {
      title: "Start from Scratch",
      description: "Build a professional resume step-by-step with AI.",
      icon: <FilePlus className="text-[#79e708] w-7 h-7" />,
      action: "scratch",
    },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-black relative overflow-hidden pt-20">
        {/* Background Effects (copied from Ranker) */}
        <div className="absolute inset-0">
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(121, 231, 8, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(121, 231, 8, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
          {/* Orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#79e708]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#79e708]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#79e708]/6 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-12 text-center">
          {/* Title Section */}
          <div className="mb-16">

            <div className="flex justify-center mb-8">
              <h1 className="flex items-center gap-4 text-6xl lg:text-7xl font-black tracking-tight">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#79e708] to-[#5bb406] rounded-2xl shadow-2xl shadow-[#79e708]/30">
                  <span className="text-3xl font-black text-black">AI</span>
                </div>
                <span className="bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
                  Resume Builder
                </span>
              </h1>
            </div>

            <p className="text-xl text-gray-400 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
              Whether you’re{" "}
              <span className="text-[#79e708] font-semibold">enhancing</span> your old resume,
              importing from{" "}
              <span className="text-[#79e708] font-semibold">LinkedIn</span>, or{" "}
              <span className="text-[#79e708] font-semibold">starting fresh</span> —
              our AI-powered tools have you covered.
            </p>
          </div>

          {/* Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {options.map((opt, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-[#79e708]/20 rounded-3xl p-8 text-left hover:border-[#79e708]/40 hover:-translate-y-3 hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer"
                onClick={() => handleOptionClick(opt.action)}
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#79e708]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#79e708]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#79e708]/20 to-[#79e708]/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {opt.icon}
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3 group-hover:text-[#79e708] transition-colors">
                    {opt.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{opt.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ResumeBuilder;
