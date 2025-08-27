import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "../../components/landing/Navigation";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../store/authStore"; // Adjust to your auth store
import { useAuth0 } from "@auth0/auth0-react";
import { existingJobDescs } from "../../data/jobDescription";

const steps = [
    { id: "upload", label: "Upload / Select Resume" },
    { id: "jobDesc", label: "Select Job Description" },
    { id: "preparing", label: "Preparing Interview Questions" },
    { id: "start", label: "Start Interview" },
];

const MockInterviewer = () => {
    const [currentStep, setCurrentStep] = useState("upload");
    const [selectedFile, setSelectedFile] = useState(null);
    const [interviewData, setInterviewData] = useState({ resume: "", jobDescription: "" });
    const [customJobDesc, setCustomJobDesc] = useState("");
    const [questions, setQuestions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", text: "", skills: [] });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { loginWithPopup } = useAuth0();
    const [extractedText, setExtractedText] = useState("");

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf" && !file.type.includes("word")) {
            alert("Please upload a PDF or DOCX file");
            return;
        }

        setSelectedFile(file);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("resume", file);

            const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/resume/extract-text`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setExtractedText(data.text);
            setInterviewData(prev => ({ ...prev, resume: data.text }));
        } catch (err) {
            alert("Error extracting resume text");
        } finally {
            setLoading(false);
        }
    };

    const handleProceed = async () => {
        // Step 1: Upload / Saved Resume
        if (currentStep === "upload" && !selectedFile && !user?.savedResume) {
            alert("Please upload a resume or use your saved resume.");
            return;
        }

        if (currentStep === "upload") {
            // Log resume content before proceeding

            setCurrentStep("jobDesc");
            return;
        }

        // Step 2: Job Description selected
        if (currentStep === "jobDesc") {
            if (!interviewData.jobDescription) {
                alert("Please select or enter a job description.");
                return;
            }

            setCurrentStep("preparing");
            setLoading(true);

            try {
                const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/resume/mock-interview`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        resume: interviewData.resume || user?.savedResume || "",
                        jobDescription: interviewData.jobDescription
                    }),
                });

                const data = await res.json();

                if (!data.questions) {
                    throw new Error("No questions received from API");
                }

                setQuestions(data.questions); // Store questions in state
                setCurrentStep("start");      // Automatically move to start
            } catch (err) {
                console.error("Error fetching interview questions:", err);
                alert("Failed to fetch interview questions. Please try again.");
                setCurrentStep("jobDesc"); // Go back to JD step if error
            } finally {
                setLoading(false);
            }
            return;
        }

        // Step 3: Start Interview
        if (currentStep === "start") {
            navigate("/mock-interviewer/interview", {
                state: {
                    resume: interviewData.resume || user?.savedResume || "",
                    jobDescription: interviewData.jobDescription,
                    questions
                }
            });
        }
    };

    const handleUseResume = (resumeContent) => {
        setInterviewData(prev => ({
            ...prev,
            resume: resumeContent
        }));
    };

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-black relative overflow-hidden pt-10">
                {/* Background Effects */}
                <div className="absolute inset-0">
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
                </div>

                {/* Content */}
                <div className="relative z-10 px-6 py-12 max-w-4xl mx-auto text-center">
                    <h1 className="flex items-center justify-center gap-4 text-6xl lg:text-7xl font-black mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#79e708] to-[#5bb406] rounded-2xl shadow-2xl shadow-[#79e708]/30">
                            <span className="text-3xl font-black text-black">AI</span>
                        </div>
                        <span className="bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
                            Mock Interviewer
                        </span>
                    </h1>
                    <p className="text-gray-400 mb-12">
                        Prepare with <span className="text-[#79e708] font-semibold">realistic</span> interview simulations,
                        receive <span className="text-[#79e708] font-semibold">AI feedback</span>, and practice for any role.
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
                                className="flex flex-col md:flex-row gap-8 justify-center"
                            >
                                {/* Left: Upload Resume */}
                                <div className="flex-1 flex flex-col items-center p-8 bg-gray-900/50 border border-[#79e708]/20 rounded-3xl">
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
                                </div>

                                {/* Right: Saved Resume / Login */}
                                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-900/50 border border-[#79e708]/20 rounded-3xl">
                                    {user ? (
                                        <>
                                            <h2 className="text-white text-2xl font-bold mb-4">Continue with Saved Resume</h2>
                                            <p className="text-gray-400 mb-2">{user.name}</p>

                                            {/* Check for missing sections */}
                                            {(!user.education?.length ||
                                                !user.certifications?.length ||
                                                !user.skills?.length ||
                                                !user.workExperience?.length) && (
                                                    <p className="text-yellow-400 text-sm mb-4">
                                                        ⚠️ Your saved resume is missing some sections:{" "}
                                                        {!user.education?.length && "Education, "}
                                                        {!user.certifications?.length && "Certifications, "}
                                                        {!user.skills?.length && "Skills, "}
                                                        {!user.workExperience?.length && "Work Experience"}
                                                        .{" "}Do you want to continue?
                                                    </p>
                                                )}

                                            <div className="flex flex-row gap-2">
                                                <Button
                                                    onClick={() => {
                                                        const combinedResume = `
                                                        ${(user.education || []).join("\n")}
                                                        ${(user.certifications || []).join("\n")}
                                                        ${(user.skills || []).join("\n")}
                                                        ${(user.workExperience || []).join("\n")}
                                                        `;
                                                        handleUseResume(combinedResume);
                                                        setCurrentStep("jobDesc"); // go to JD step
                                                    }}
                                                    className="px-6 py-3 bg-[#79e708] text-black font-semibold rounded-xl hover:bg-[#5bb406] transition"
                                                >
                                                    Use Saved Resume
                                                </Button>

                                                <Button
                                                    onClick={() => navigate("/profile")}
                                                    className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition"
                                                >
                                                    Review / Edit Resume
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-white text-2xl font-bold mb-4">Login to Use Saved Resume</h2>
                                            <p className="text-gray-400 mb-6 text-center">
                                                Log in to continue with your saved resume for a faster experience.
                                            </p>
                                            <Button
                                                onClick={loginWithPopup}
                                                className="px-6 py-3 bg-[#79e708] text-black font-semibold rounded-xl hover:bg-[#5bb406] transition"
                                            >
                                                Login
                                            </Button>
                                        </>
                                    )}
                                </div>


                            </motion.div>
                        )}

                        {currentStep === "jobDesc" && (
                            <motion.div
                                key="jobDesc"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="flex flex-col md:flex-row gap-8 justify-center"
                            >
                                {/* Left: Custom Job Description */}
                                <div className="flex-1 flex flex-col p-6 bg-gray-900/50 border border-[#79e708]/20 rounded-3xl">
                                    <h2 className="text-white text-xl font-bold mb-4">Paste Custom Job Description</h2>
                                    <textarea
                                        value={customJobDesc}
                                        onChange={(e) => setCustomJobDesc(e.target.value)}
                                        placeholder="Paste your job description here..."
                                        className="w-full h-60 p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#79e708] resize-none"
                                    />
                                    <Button
                                        onClick={async () => {
                                            const jdString = customJobDesc;
                                            setInterviewData(prev => ({
                                                ...prev,
                                                jobDescription: jdString
                                            }));
                                            setCurrentStep("preparing"); // go to preparing step
                                            setLoading(true);

                                            try {
                                                const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/resume/mock-interview`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        resume: interviewData.resume || user?.savedResume || "",
                                                        jobDescription: jdString
                                                    }),
                                                });

                                                const data = await res.json();
                                                if (!data.questions) throw new Error("No questions received from API");

                                                setQuestions(data.questions);
                                                setCurrentStep("start"); // move automatically to start
                                            } catch (err) {
                                                console.error("Error fetching interview questions:", err);
                                                alert("Failed to fetch interview questions. Please try again.");
                                                setCurrentStep("jobDesc"); // go back to JD step if error
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        disabled={!customJobDesc.trim()}
                                        className="mt-4 px-6 py-3 bg-[#79e708] text-black font-semibold rounded-xl hover:bg-[#5bb406] transition"
                                    >
                                        Use Custom JD
                                    </Button>

                                </div>

                                {/* Right: Existing Job Descriptions */}
                                <div className="flex-1 flex flex-col p-6 bg-gray-900/50 border border-[#79e708]/20 rounded-3xl">
                                    <h2 className="text-white text-xl font-bold mb-4">Select Existing Job Description</h2>
                                    <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                                        {existingJobDescs.map((jd, idx) => (
                                            <Button
                                                key={idx}
                                                onClick={() => {
                                                    setModalContent(jd); // set modal content
                                                    setModalOpen(true);   // open the modal
                                                }}
                                                className={`text-left px-4 py-2 rounded-xl border border-gray-700 hover:border-[#79e708] hover:bg-[#79e708]/10 transition`}
                                            >
                                                {jd.title}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === "preparing" && (
                            <motion.div
                                key="preparing"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="text-center"
                            >
                                <img src="/f8e57931-7a82-474f-980b-dc7951fcc4c7.gif" alt="" className="mx-auto" />
                                <p className="mt-6 text-gray-400">Preparing your interview questions...</p>
                            </motion.div>
                        )}

                        {currentStep === "start" && (
                            <motion.div
                                key="start"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="text-center"
                            >
                                <p className="text-gray-400 mb-6">You’re ready to start your mock interview!</p>
                                <Button
                                    onClick={handleProceed}
                                    className="px-6 py-3 bg-[#79e708] text-black font-semibold rounded-xl hover:bg-[#5bb406] transition"
                                >
                                    Start Interview
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {modalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-gray-900 rounded-3xl p-8 max-w-lg w-full text-white shadow-2xl relative"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                                >
                                    ✕
                                </button>

                                <h2 className="text-3xl font-extrabold mb-4 text-[#79e708]">{modalContent.title}</h2>
                                <p className="mb-6 text-gray-300 leading-relaxed">{modalContent.text}</p>

                                {modalContent.skills?.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold mb-3 text-white">Skills Required:</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {modalContent.skills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-[#79e708]/20 text-[#79e708] rounded-full text-sm font-medium shadow-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3">
                                    <Button
                                        onClick={async () => {
                                            const jdString = `${modalContent.text}\n\nSkills Required: ${modalContent.skills?.join(", ") || "N/A"}`;
                                            setInterviewData(prev => ({
                                                ...prev,
                                                jobDescription: jdString
                                            }));

                                            setModalOpen(false);
                                            setCurrentStep("preparing"); // go to preparing step
                                            setLoading(true);

                                            try {
                                                const body = {
                                                    resume: interviewData.resume || user?.savedResume || "",
                                                    jobDescription: jdString
                                                };

                                                const res = await fetch(`${import.meta.env.VITE_API_PORT}/api/resume/mock-interview`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify(body),
                                                });

                                                const data = await res.json();
                                                if (!data.questions) throw new Error("No questions received from API");

                                                setQuestions(data.questions);
                                                setCurrentStep("start"); // automatically move to start
                                            } catch (err) {
                                                console.error("Error fetching interview questions:", err);
                                                alert("Failed to fetch interview questions. Please try again.");
                                                setCurrentStep("jobDesc"); // fallback to JD step
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="px-6 py-3 bg-[#79e708] text-black rounded-xl hover:bg-[#5bb406] transition font-semibold"
                                    >
                                        Use This JD
                                    </Button>
                                    <Button
                                        onClick={() => setModalOpen(false)}
                                        className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition font-semibold"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-center">
                        {currentStep !== "start" && currentStep !== "jobDesc" && currentStep !== "preparing" && (
                            <Button
                                onClick={handleProceed}
                                disabled={
                                    loading ||
                                    (currentStep === "upload" && (!selectedFile && !user?.savedResume || !extractedText))
                                }
                                className="px-6 py-3 bg-[#79e708] text-black font-semibold rounded-xl hover:bg-[#5bb406] transition"
                            >
                                {loading ? "Loading..." : "Next Step"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MockInterviewer;
