import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { questions, answers, jobDescription } = location.state || {};
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQA, setShowQA] = useState(false);

  useEffect(() => {
    if (!questions || !answers || !jobDescription) return;

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_API_PORT}/api/resume/analyze-interview`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions, answers, jobDescription }),
          }
        );

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to analyze interview");
        }

        setReport(data.report);
      } catch (err) {
        console.error("❌ Analysis API error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [questions, answers, jobDescription]);

  return (
    <div className="min-h-screen bg-black text-white p-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#79e708]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#79e708]/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-center text-5xl font-black mb-12 bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
          Interview Summary
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT SIDE - Job Description + Q&A */}
          <div className="space-y-8">
            {/* Job Description */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-[#79e708]/30 rounded-3xl shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#79e708] mb-4">📋 Job Description</h2>
                <p className="text-gray-300 whitespace-pre-line">{jobDescription}</p>
              </CardContent>
            </Card>

            {/* Q&A */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-[#79e708]/30 rounded-3xl shadow-xl">
              <CardContent className="p-6">
                <button
                  onClick={() => setShowQA(!showQA)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <h2 className="text-xl font-bold text-[#79e708]">💬 Interview Q&A</h2>
                  {showQA ? <ChevronUp /> : <ChevronDown />}
                </button>
                {showQA && (
                  <div className="mt-4 space-y-4">
                    {questions?.map((q, i) => (
                      <div
                        key={i}
                        className="bg-black/40 border border-gray-700 rounded-2xl p-4 hover:border-[#79e708]/40 transition-all"
                      >
                        <p className="font-semibold text-white">Q{i + 1}: {q}</p>
                        <p className="text-gray-400 mt-2">Ans: {answers?.[i] || "Not answered"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE - AI Analysis */}
          <div>
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-[#79e708]/30 rounded-3xl shadow-2xl h-full">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-black text-[#79e708]">🤖 AI Analysis</h2>

                {loading && (
                  <div className="flex items-center space-x-2 text-[#79e708]">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Analyzing your responses...</span>
                  </div>
                )}

                {error && <p className="text-red-400">⚠ {error}</p>}

                {report && (
                  <div className="space-y-6">
                    {/* Score */}
                    <div className="text-center">
                      <p className="text-3xl font-black bg-gradient-to-r from-[#79e708] to-green-400 bg-clip-text text-transparent">
                        Overall Score: {report.overallScore}
                      </p>
                    </div>

                    {/* Strengths */}
                    <div>
                      <p className="font-bold text-white mb-3">✅ Strengths</p>
                      <div className="flex flex-wrap gap-2">
                        {report.strengths?.map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-[#79e708]/20 border border-[#79e708]/40 text-[#79e708] px-3 py-1 rounded-full text-sm"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Weaknesses */}
                    <div>
                      <p className="font-bold text-white mb-3">⚠ Weaknesses</p>
                      <div className="flex flex-wrap gap-2">
                        {report.weaknesses?.map((w, idx) => (
                          <span
                            key={idx}
                            className="bg-red-600/20 border border-red-500/40 text-red-300 px-3 py-1 rounded-full text-sm"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <p className="font-bold text-white mb-3">💡 Recommendations</p>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {report.recommendations?.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Summary */}
                    <div className="bg-black/40 border border-gray-700 rounded-2xl p-5">
                      <p className="font-bold text-white">📌 Summary</p>
                      <p className="text-gray-300 mt-2">{report.summary}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-12">
          <Button
            onClick={() => navigate("/mock-interviewer/interview")}
            className="bg-gradient-to-r from-[#79e708] to-[#5bb406] text-black font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            🔄 Retry Interview
          </Button>
          <Button
            onClick={() => alert("PDF Download coming soon!")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            📥 Download Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
