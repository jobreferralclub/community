import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Loader2, CheckCircle, Brain, Zap, Target } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Navigation from "../../../components/landing/Navigation";
import Footer from "../../../components/landing/Footer";

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.toLowerCase().split(".").pop();
      if (fileExtension === "pdf" || fileExtension === "docx") {
        setSelectedFile(file);
        setError("");
      } else {
        setError("Please upload a PDF or DOCX file");
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }
    setIsLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await fetch(
        import.meta.env.VITE_API_PORT + "/api/resume/analyze",
        { method: "POST", body: formData }
      );

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem("analysisResult", JSON.stringify(result.data));
        navigate("/analyzer-result");
      } else {
        setError(result.error || "Analysis failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-[#79e708]" />,
      title: "AI Resume Analysis",
      description: "Smart algorithms parse and rank resumes automatically",
    },
    {
      icon: <Target className="w-8 h-8 text-[#79e708]" />,
      title: "Smart Match Accuracy",
      description: "Precise candidate-job matching with ML algorithms",
    },
    {
      icon: <Zap className="w-8 h-8 text-[#79e708]" />,
      title: "Lightning Fast Ranking",
      description: "Process hundreds of resumes in seconds",
    },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-black relative overflow-hidden mt-16">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          {/* Heading */}
          <div className="flex justify-center mb-8">
            <h1 className="flex items-center gap-4 text-6xl lg:text-7xl font-black tracking-tight">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#79e708] to-[#5bb406] rounded-2xl shadow-2xl shadow-[#79e708]/30">
                <span className="text-3xl font-black text-black">AI</span>
              </div>
              <span className="bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
                Resume Analyzer
              </span>
            </h1>
          </div>
          <p className="text-center text-gray-400 mb-12">
            Get your resume ATS-ready and stand out with AI-powered insights.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-center shadow-lg"
              >
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Upload Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <p className="mt-4 text-white">✅ {selectedFile.name}</p>
            )}

            {error && (
              <p className="mt-4 text-red-500 font-semibold">{error}</p>
            )}

            <Button
              type="submit"
              disabled={!selectedFile || isLoading}
              className="mt-6 bg-gradient-to-r from-[#79e708] to-[#5bb406] hover:brightness-110 text-black font-semibold px-6 py-2 rounded-full shadow transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  🚀 Analyze My Resume
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ResumeAnalyzer;
