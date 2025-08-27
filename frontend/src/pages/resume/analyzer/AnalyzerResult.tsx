import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../../components/landing/Navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Sparkles, CheckCircle2, XCircle } from "lucide-react";

interface AnalysisResult {
  candidate_name: string;
  scores: {
    content_quality: number;
    resume_structure: number;
    ats_essentials: number;
    overall_score: number;
  };
  subpoints: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
  suggestions: {
    [key: string]: string;
  };
}

const AnalyzerResult: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("analysisResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      navigate("/resume-analyzer");
    }
  }, [navigate]);

  const handleNewAnalysis = () => {
    sessionStorage.removeItem("analysisResult");
    navigate("/resume-analyzer");
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-gray-300">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p>Analyzing your resume...</p>
        </div>
      </div>
    );
  }

  const getScoreClass = (score: number) => {
    if (score >= 80) return "bg-green-500/20 text-green-400";
    if (score >= 60) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const formatTitle = (text: string) =>
    text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-black relative overflow-hidden mt-16">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Back Button */}
          <button
            onClick={handleNewAnalysis}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> New Analysis
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="flex items-center justify-center gap-3 text-5xl lg:text-6xl font-black tracking-tight">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#79e708] to-[#5bb406] rounded-2xl shadow-2xl shadow-[#79e708]/30">
                <BarChart3 className="w-7 h-7 text-black" />
              </div>
              <span className="bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
                Resume Analysis Report
              </span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg">{result.candidate_name}</p>
          </div>

          {/* Overall Score */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 text-center shadow-xl mb-12">
            <div className="text-gray-400 flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#79e708]" />
              Overall Resume Score
            </div>
            <div className="text-5xl font-black text-white">
              {result.scores.overall_score}/100
            </div>
          </div>

          {/* Section Scores */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {Object.entries(result.scores).map(([section, score]) => {
              if (section === "overall_score") return null;
              return (
                <motion.div
                  key={section}
                  whileHover={{ scale: 1.03 }}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold text-lg">
                      {formatTitle(section)}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreClass(
                        score
                      )}`}
                    >
                      {score}/100
                    </span>
                  </div>

                  {/* Subpoints */}
                  <div className="space-y-2 mb-4">
                    {result.subpoints[section] &&
                      Object.entries(result.subpoints[section]).map(
                        ([subpoint, passed]) => (
                          <div
                            key={subpoint}
                            className={`flex items-center gap-2 text-sm ${
                              passed ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {passed ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            {formatTitle(subpoint)}
                          </div>
                        )
                      )}
                  </div>

                  {/* Suggestion */}
                  <div className="bg-black/40 border border-zinc-800 rounded-lg p-3 text-sm text-gray-300">
                    💡 {result.suggestions[section]}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Overall Suggestions */}
          <div className="bg-gradient-to-br from-[#79e708]/10 to-[#5bb406]/10 border border-[#79e708]/30 rounded-2xl p-8 text-center shadow-xl">
            <div className="flex items-center justify-center gap-2 text-[#79e708] mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-lg font-semibold">Key Improvement Areas</span>
            </div>
            <p className="text-gray-300">{result.suggestions.overall}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyzerResult;
