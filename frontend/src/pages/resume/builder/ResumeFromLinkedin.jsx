import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import lottie from "lottie-web";
import { useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import useResumeStore from "../../../store/useResumeStore";
import LivePreview from "../../../components/resume/builder/LivePreview";
import LinkedInExportGuide from "../../../components/resume/builder/LinkedinExportGuide";
import TemplateSelectionPopup from "../../../components/resume/builder/TemplateSelectionPopup";
import useTemplateStore from "@/store/useTemplateStore";

const ResumeFromLinkedin = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("idle");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const lottieContainerRef = useRef(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_PORT;

  // ✅ Template popup state
  const [showTemplatePopup, setShowTemplatePopup] = useState(false);
  const [popupShownOnce, setPopupShownOnce] = useState(false);
  const currentTemplate = useTemplateStore((state) => state.currentTemplate);

  const resumeTips = [
    "Tailor your resume for each job application.",
    "Use action verbs like 'Led', 'Built', 'Achieved'.",
    "Quantify accomplishments with metrics.",
    "Keep it concise—ideally one page for < 10 years experience.",
    "Highlight ATS-friendly keywords from job descriptions.",
    "Avoid passive phrases like 'Responsible for...'",
    "Include relevant side projects or contributions.",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTips, setShowTips] = useState(false);

  const { updatePersonalInfo, addExperience, addEducation, addSkill, addProject } = useResumeStore();

  // ✅ Resume tips cycling
  useEffect(() => {
    let tipInterval;
    if (step === "formatting") {
      setShowTips(true);
      tipInterval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % resumeTips.length);
      }, 3500);
    } else {
      setShowTips(false);
      clearInterval(tipInterval);
    }
    return () => clearInterval(tipInterval);
  }, [step]);

  // ✅ Lottie animation
  useEffect(() => {
    if (!showSuccessMessage || !lottieContainerRef.current) return;
    const animation = lottie.loadAnimation({
      container: lottieContainerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/Generate Resume.json",
    });
    return () => animation.destroy();
  }, [showSuccessMessage]);

  // ✅ Show template popup when done
  useEffect(() => {
    if (step === "done" && !popupShownOnce && !currentTemplate) {
      setShowTemplatePopup(true);
      setPopupShownOnce(true);
    }
  }, [step, popupShownOnce, currentTemplate]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleFormatResume = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("resume", selectedFile);
    setStep("uploading");
    setLoading(true);

    try {
      const extractRes = await axios.post(`${apiUrl}/api/resume/extract-text`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedText = extractRes.data.text;
      setStep("formatting");

      const formatRes = await axios.post(`${apiUrl}/api/resume/format-pdf`, {
        resumeText: extractedText,
      });

      const data = formatRes.data;
      const { personalInfo, experience, education, skills, projects } = data;

      Object.entries(personalInfo).forEach(([key, value]) => {
        updatePersonalInfo(key, value);
      });

      experience?.forEach((item) => addExperience(item));
      education?.forEach((item) => addEducation(item));
      skills?.forEach((item) => addSkill(item));
      projects?.forEach((item) => addProject(item));

      setStep("done");
      setShowSuccessMessage(true);
      setTimeout(() => setIsFadingOut(true), 3000);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setIsFadingOut(false);
      }, 3500);
    } catch (error) {
      alert("Error formatting resume. Is backend running?");
      setStep("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] text-white py-12 px-4">
      {/* ✅ Template Popup */}
      {showTemplatePopup && <TemplateSelectionPopup />}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 transition-all duration-500">
        {/* Left Panel */}
        <div
          className={`backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden transition-all duration-500 ${
            step === "done" ? "w-full lg:w-1/2" : "w-full"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#79e7081a] via-transparent to-transparent rounded-3xl pointer-events-none z-0" />
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent tracking-tight">
              LinkedIn Resume Formatter
            </h1>

            <p className="text-center text-gray-400 mb-10 max-w-xl mx-auto">
              Upload your <span className="font-semibold text-white">LinkedIn PDF resume</span>. We’ll convert it into a structured format for easy editing.
            </p>

            <LinkedInExportGuide />

            {/* Upload Box */}
            <div className="my-8">
              <label
                htmlFor="resumeUpload"
                className="cursor-pointer border-2 border-dashed border-lime-400/50 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-4 text-center hover:bg-lime-400/5 transition-all"
              >
                <UploadCloud className="w-10 h-10 text-lime-400" />
                <span className="text-white font-semibold text-lg">
                  Click to upload your LinkedIn resume
                </span>
                <span className="text-sm text-gray-400">
                  Accepted format: <strong>PDF</strong>
                </span>
                <Input
                  id="resumeUpload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {selectedFile && (
                <div className="mt-4 flex items-center justify-center gap-2 text-white text-sm">
                  <UploadCloud className="w-4 h-4 text-lime-400" />
                  <span>{selectedFile.name}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={handleFormatResume}
                disabled={loading || !selectedFile}
                className="bg-gradient-to-r from-lime-400 to-green-500 hover:brightness-110 text-black font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Formatting Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" /> Format Resume
                  </>
                )}
              </Button>
            </div>

            {/* Tips */}
            {showTips && (
              <div className="mt-6 text-center text-sm text-gray-400 min-h-[24px]">
                <SwitchTransition>
                  <CSSTransition
                    key={resumeTips[currentTipIndex]}
                    timeout={500}
                    classNames="fade"
                  >
                    <div>{resumeTips[currentTipIndex]}</div>
                  </CSSTransition>
                </SwitchTransition>
              </div>
            )}

            {/* After Done */}
            {step === "done" && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => navigate("/ai-resume-builder/preview")}
                  className="bg-white text-black font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-200 transition-all"
                >
                  Edit Resume
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        {step === "done" && (
          <div className="w-full lg:w-1/2 transition-all duration-500">
            <LivePreview />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeFromLinkedin;
