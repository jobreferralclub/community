import React, { useState, useEffect } from "react";
import lottie from "lottie-web";
import { Sparkles, Loader2, UploadCloud, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useResumeStore from "../../../store/useResumeStore";
import LivePreview from "../../../components/resume/builder/LivePreview";
import TemplateSelectionPopup from "../../../components/resume/builder/TemplateSelectionPopup";
import useTemplateStore from "@/store/useTemplateStore";
import Navigation from "../../../components/landing/Navigation";

const steps = [
    { id: "upload", label: "Upload Resume" },
    { id: "enhance", label: "AI Enhance" },
    { id: "preview", label: "Preview" },
    { id: "download", label: "Download" },
];

const ResumeEnhancer = () => {
    const [resumeText, setResumeText] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState("upload");
    const [selectedFile, setSelectedFile] = useState(null);
    const [showTemplatePopup, setShowTemplatePopup] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_PORT;

    const currentTemplate = useTemplateStore((state) => state.currentTemplate);

    const {
        updatePersonalInfo,
        addExperience,
        addEducation,
        addSkill,
        addProject,
    } = useResumeStore();

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        const formData = new FormData();
        formData.append("resume", file);
        setLoading(true);
        try {
            const res = await axios.post(`${apiUrl}/api/resume/extract-text`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResumeText(res.data.text);
        } catch {
            alert("Error extracting text. Is backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleEnhance = async () => {
        if (!resumeText.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post(`${apiUrl}/api/resume/enhance-resume`, {
                resumeText,
            });

            const { personalInfo, experience, education, skills, projects } = res.data;
            Object.entries(personalInfo).forEach(([k, v]) => updatePersonalInfo(k, v));
            experience?.forEach(addExperience);
            education?.forEach(addEducation);
            skills?.forEach(addSkill);
            projects?.forEach(addProject);

            setCurrentStep("preview");
            if (!currentTemplate) setShowTemplatePopup(true);
        } catch {
            alert("Error enhancing resume. Check backend/API key.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-black relative overflow-hidden mt-16">
                {/* Steps + Heading */}
                <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                    <div className="flex justify-center mb-8">
                        <h1 className="flex items-center gap-4 text-6xl lg:text-7xl font-black tracking-tight">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#79e708] to-[#5bb406] rounded-2xl shadow-2xl shadow-[#79e708]/30">
                                <span className="text-3xl font-black text-black">AI</span>
                            </div>
                            <span className="bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
                                Resume Enhancer
                            </span>
                        </h1>
                    </div>
                    <p className="text-center text-gray-400 mb-12">
                        Follow the steps below to upload, enhance, and preview your resume before continuing.
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
                                            ? "bg-[#79e708] border-[#79e708] text-black"
                                            : active
                                                ? "border-[#79e708] text-[#79e708]"
                                                : "border-gray-700 text-gray-500"
                                            }`}
                                    >
                                        {completed ? <CheckCircle className="w-6 h-6" /> : i + 1}
                                    </div>
                                    <span
                                        className={`mt-2 text-sm ${completed || active ? "text-white" : "text-gray-500"
                                            }`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        {/* Upload Step */}
                        {currentStep === "upload" && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="text-center"
                            >
                                <label
                                    htmlFor="resumeUpload"
                                    className="cursor-pointer border-2 border-dashed border-[#79e708]/50 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-4 text-center hover:bg-[#79e708]/5 transition-all"
                                >
                                    <UploadCloud className="w-10 h-10 text-[#79e708]" />
                                    <span className="text-white font-semibold text-lg">
                                        Click to upload your resume
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        Accepted formats: <strong>PDF</strong>, <strong>DOCX</strong>
                                    </span>
                                    <Input
                                        id="resumeUpload"
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </label>
                                {selectedFile && <p className="mt-4 text-white">{selectedFile.name}</p>}

                                {/* Enhance Button (replaces Continue) */}
                                <Button
                                    onClick={() => {
                                        setCurrentStep("enhance"); // move to loader step
                                        handleEnhance(); // start enhancing
                                    }}
                                    disabled={!resumeText || loading}
                                    className="mt-6 bg-gradient-to-r from-[#79e708] to-[#5bb406] hover:brightness-110 text-black font-semibold px-6 py-2 rounded-full shadow transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enhancing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" /> Enhance with AI
                                        </>
                                    )}
                                </Button>

                            </motion.div>
                        )}


                        {currentStep === "enhance" && (
                            <motion.div
                                key="enhance"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="text-center"
                            >
                                <img src="/f8e57931-7a82-474f-980b-dc7951fcc4c7.gif" alt="" className="mx-auto" />
                                <p className="mt-6 text-gray-400">Enhancing your resume with AI...</p>
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
                                        className="bg-gradient-to-r from-[#79e708] to-[#5bb406] hover:brightness-110 text-black font-semibold px-6 py-2 rounded-full shadow transition-all"
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
                                <h2 className="text-2xl font-bold mb-4">
                                    🎉 Resume Process Completed!
                                </h2>
                                <p className="text-gray-400 mb-6">
                                    You’re ready to move forward with your enhanced resume.
                                </p>

                                <Button
                                    onClick={() => {
                                        // replace this with your actual download logic
                                        // e.g., calling backend API or generating PDF from template
                                        alert("Downloading your resume...");
                                    }}
                                    className="bg-gradient-to-r from-[#79e708] to-[#5bb406] hover:brightness-110 text-black font-semibold px-6 py-3 rounded-full shadow-lg transition-all"
                                >
                                    Download Resume
                                </Button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {showTemplatePopup && <TemplateSelectionPopup />}
            </div>
        </>
    );
};

export default ResumeEnhancer;
