import React, { useState } from "react";
import { UploadCloud, Loader2, Sparkles, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useResumeStore from "../../../store/useResumeStore";
import LivePreview from "../../../components/resume/builder/LivePreview";
import TemplateSelectionPopup from "../../../components/resume/builder/TemplateSelectionPopup";
import useTemplateStore from "@/store/useTemplateStore";
import Navigation from "../../../components/landing/Navigation";

// ✅ LinkedIn Export Guide (only steps 1–3)
const LinkedInExportGuide = () => {
  const steps = [
    {
      id: 1,
      title: "Go to your LinkedIn profile page",
      image: "/images/step1-profile-page.png",
    },
    {
      id: 2,
      title: "Click the More / Resources button under your profile header",
      image: "/images/step2-more-button.png",
    },
    {
      id: 3,
      title: "Select Save to PDF from the dropdown menu",
      image: "/images/step3-save-to-pdf.png",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 shadow-2xl">
      <div className="relative flex flex-col md:grid md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className="group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-lg hover:border-lime-400/50 hover:shadow-lime-400/10 transition-all"
          >
            {/* Step Number */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-lime-400 to-green-500 text-black font-bold rounded-full shadow-lg border border-white/20">
              {step.id}
            </div>

            {/* Title */}
            <p className="text-white font-medium mb-4">{step.title}</p>

            {/* Step Image (sticks to bottom) */}
            {step.image && (
              <div className="mt-auto w-full">
                <img
                  src={step.image}
                  alt={`Step ${step.id}`}
                  className="rounded-xl border border-zinc-700 shadow-md w-full object-contain group-hover:border-lime-400/40 transition-all aspect-square bg-white"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ Main ResumeFromLinkedin Flow
const steps = [
  { id: "upload", label: "Upload Resume" },
  { id: "format", label: "AI Format" },
  { id: "preview", label: "Preview" },
  { id: "download", label: "Download" },
];

const ResumeFromLinkedin = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("upload");
  const [showTemplatePopup, setShowTemplatePopup] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_PORT;

  const currentTemplate = useTemplateStore((state) => state.currentTemplate);
  const { updatePersonalInfo, addExperience, addEducation, addSkill, addProject } = useResumeStore();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleFormatResume = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setCurrentStep("format");

    try {
      // extract text
      const formData = new FormData();
      formData.append("resume", selectedFile);
      const extractRes = await axios.post(`${apiUrl}/api/resume/extract-text`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedText = extractRes.data.text;

      // format resume
      const formatRes = await axios.post(`${apiUrl}/api/resume/format-pdf`, { resumeText: extractedText });
      const { personalInfo, experience, education, skills, projects } = formatRes.data;

      Object.entries(personalInfo).forEach(([k, v]) => updatePersonalInfo(k, v));
      experience?.forEach(addExperience);
      education?.forEach(addEducation);
      skills?.forEach(addSkill);
      projects?.forEach(addProject);

      setCurrentStep("preview");
      if (!currentTemplate) setShowTemplatePopup(true);
    } catch (error) {
      alert("Error formatting resume. Is backend running?");
      setCurrentStep("upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-black relative overflow-hidden py-12 px-4 mt-16">
        {showTemplatePopup && <TemplateSelectionPopup />}

        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="flex justify-center mb-4">
            <h1 className="flex items-center gap-4 text-6xl lg:text-7xl font-black tracking-tight">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#79e708] to-[#5bb406] rounded-2xl shadow-2xl shadow-[#79e708]/30">
                <span className="text-3xl font-black text-black">AI</span>
              </div>
              <span className="bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
                Resume from LinkedIn
              </span>
            </h1>
          </div>
          <p className="text-center text-gray-400 mb-5">
            Follow these steps to export and upload your LinkedIn resume.
          </p>

          {/* Steps Indicator */}
          <div className="flex justify-between items-center mb-12">
            {steps.map((s, i) => {
              const activeIndex = steps.findIndex((st) => st.id === currentStep);
              const completed = i < activeIndex;
              const active = s.id === currentStep;
              return (
                <div key={s.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all ${completed
                      ? "bg-lime-400 border-lime-400 text-black"
                      : active
                        ? "border-lime-400 text-lime-400"
                        : "border-gray-700 text-gray-500"
                      }`}
                  >
                    {completed ? <CheckCircle className="w-6 h-6" /> : i + 1}
                  </div>
                  <span className={`mt-2 text-sm ${completed || active ? "text-white" : "text-gray-500"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {currentStep === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start"
              >
                {/* Left: Steps 1-3 (70%) */}
                <div className="lg:col-span-7">
                  <LinkedInExportGuide />
                </div>

                {/* Right: Upload (30%) */}
                <div className="lg:col-span-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center">
                  <label
                    htmlFor="resumeUpload"
                    className="cursor-pointer border-2 border-dashed border-lime-400/50 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-4 text-center hover:bg-lime-400/5 transition-all w-full"
                  >
                    <UploadCloud className="w-10 h-10 text-lime-400" />
                    <span className="text-white font-semibold text-lg">
                      Click to upload your LinkedIn PDF
                    </span>
                    <span className="text-sm text-gray-400">Accepted format: <strong>PDF</strong></span>
                    <Input id="resumeUpload" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  </label>

                  {selectedFile && <p className="mt-4 text-white">{selectedFile.name}</p>}

                  <Button
                    onClick={handleFormatResume}
                    disabled={!selectedFile || loading}
                    className="mt-6 w-full bg-gradient-to-r from-lime-400 to-green-500 hover:brightness-110 text-black font-semibold px-6 py-2 rounded-full shadow"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" /> Format Resume
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "format" && (
              <motion.div
                key="format"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="text-center"
              >
                <img src="/f8e57931-7a82-474f-980b-dc7951fcc4c7.gif" alt="" className="mx-auto" />
                <p className="mt-6 text-gray-400">Formatting your LinkedIn resume...</p>
              </motion.div>
            )}

            {currentStep === "preview" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <LivePreview />
                <div className="flex justify-center mt-6 gap-4">
                  <Button
                    onClick={() => navigate("/ai-resume-builder/preview")}
                    className="bg-white text-black font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-200 transition-all"
                  >
                    Edit Resume
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("download")}
                    className="bg-gradient-to-r from-lime-400 to-green-500 hover:brightness-110 text-black font-semibold px-6 py-2 rounded-full shadow"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "download" && (
              <motion.div
                key="download"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="text-center text-white"
              >
                <h2 className="text-2xl font-bold mb-4">🎉 Resume Process Completed!</h2>
                <p className="text-gray-400 mb-6">You’re ready to move forward with your formatted resume.</p>
                <Button
                  onClick={() => alert("Downloading resume...")}
                  className="bg-gradient-to-r from-lime-400 to-green-500 hover:brightness-110 text-black font-semibold px-6 py-3 rounded-full shadow-lg"
                >
                  Download Resume
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ResumeFromLinkedin;
