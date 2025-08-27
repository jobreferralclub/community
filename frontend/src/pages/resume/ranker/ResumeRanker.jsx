import Navigation from "../../../components/landing/Navigation";
import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_PORT + "/api/resume/rank";

const ResumeRanker = () => {
    const [jdText, setJdText] = useState("");
    const [techSkills, setTechSkills] = useState("");
    const [softSkills, setSoftSkills] = useState("");
    const [weightSkills, setWeightSkills] = useState(0.0);
    const [weightExperience, setWeightExperience] = useState(0.0);
    const [weightEducation, setWeightEducation] = useState(0.0);
    const [weightProjects, setWeightProjects] = useState(0.0);
    const [weightAchievements, setWeightAchievements] = useState(0.0);
    const [topN, setTopN] = useState("");
    const [resumes, setResumes] = useState(null);

    const [results, setResults] = useState([]);
    const [serverTechSkills, setServerTechSkills] = useState([]);
    const [serverSoftSkills, setServerSoftSkills] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleUpload = (e) => {
        if (e.target.files) setResumes(e.target.files);
    };

    const handleAnalyze = async () => {
        if (!jdText || !resumes) {
            alert("Please provide both Job Description and Resume files.");
            return;
        }

        const formData = new FormData();
        formData.append("jd_text", jdText);
        formData.append("tech_skills", techSkills);
        formData.append("soft_skills", softSkills);
        formData.append("weight_skills", weightSkills.toString());
        formData.append("weight_experience", weightExperience.toString());
        formData.append("weight_education", weightEducation.toString());
        formData.append("weight_projects", weightProjects.toString());
        formData.append("weight_achievements", weightAchievements.toString());
        if (topN) formData.append("top_n", topN);

        Array.from(resumes).forEach((file) => formData.append("resumes", file));

        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setResults(data.results);
            setServerTechSkills(data.tech_skills || []);
            setServerSoftSkills(data.soft_skills || []);
        } catch (err) {
            console.error(err);
            alert("Error analyzing resumes. Check backend logs.");
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        const hasTech = serverTechSkills.length > 0;
        const hasSoft = serverSoftSkills.length > 0;

        const baseHeaders = ["file_name", "candidate_name", "email", "final_score"];
        const headers = [
            ...baseHeaders,
            ...(hasTech ? serverTechSkills : []),
            ...(hasSoft ? serverSoftSkills : []),
        ];

        const rows = results.map((r) => {
            const baseCols = [r.file_name, r.candidate_name, r.email, r.final_score];
            const techCols = hasTech
                ? serverTechSkills.map((s) => r.tech_skills_scores?.[s] ?? 0)
                : [];
            const softCols = hasSoft
                ? serverSoftSkills.map((s) => r.soft_skills_scores?.[s] ?? 0)
                : [];
            return [...baseCols, ...techCols, ...softCols];
        });

        const escape = (val) => {
            const s = val == null ? "" : String(val);
            if (s.includes(",") || s.includes("\n") || s.includes('"')) {
                return `"${s.replace(/"/g, '""')}"`;
            }
            return s;
        };

        const csv =
            headers.join(",") +
            "\n" +
            rows.map((row) => row.map(escape).join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ranked_resumes.csv";
        link.click();
    };

    const features = [
        {
            icon: "🎯",
            title: "Smart",
            subtitle: "Skill Analysis",
            description:
                "AI-powered evaluation of technical and soft skills with precision scoring",
        },
        {
            icon: "⚖️",
            title: "Custom",
            subtitle: "Weightings",
            description: "Flexible criteria adjustment to match your specific hiring needs",
        },
        {
            icon: "🚀",
            title: "Instant",
            subtitle: "Rankings",
            description:
                "Real-time candidate evaluation with comprehensive performance metrics",
        },
    ];

    const weightControls = [
        { label: "Skills Weight", value: weightSkills, set: setWeightSkills, icon: "🧪" },
        { label: "Experience Weight", value: weightExperience, set: setWeightExperience, icon: "💼" },
        { label: "Education Weight", value: weightEducation, set: setWeightEducation, icon: "🎓" },
        { label: "Projects Weight", value: weightProjects, set: setWeightProjects, icon: "🚀" },
        { label: "Achievements Weight", value: weightAchievements, set: setWeightAchievements, icon: "🏆" },
    ];

    const getRankBadgeStyle = (index) => {
        if (index === 0)
            return "bg-gradient-to-br from-[#79e708] to-[#5bb406] text-black font-black shadow-xl shadow-[#79e708]/40 border-2 border-[#79e708]/30";
        if (index === 1)
            return "bg-gradient-to-br from-gray-300 to-gray-500 text-black font-black shadow-xl shadow-gray-400/40 border-2 border-gray-300/30";
        if (index === 2)
            return "bg-gradient-to-br from-amber-400 to-orange-500 text-black font-black shadow-xl shadow-amber-400/40 border-2 border-amber-400/30";
        return "bg-gradient-to-br from-gray-700 to-gray-800 text-white font-bold shadow-lg shadow-gray-700/20 border border-gray-600/50";
    };

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-black relative overflow-hidden pt-20">
                {/* Animated Neural Network Background */}
                <div className="absolute inset-0">
                    {/* Main grid pattern */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `
              linear-gradient(rgba(121, 231, 8, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(121, 231, 8, 0.03) 1px, transparent 1px)
            `,
                            backgroundSize: '60px 60px'
                        }}
                    />

                    {/* Floating orbs */}
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#79e708]/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#79e708]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#79e708]/6 rounded-full blur-3xl animate-pulse delay-500"></div>

                    {/* Circuit lines */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        <svg className="w-full h-full opacity-10" viewBox="0 0 1000 1000">
                            <defs>
                                <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#79e708" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#79e708" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>
                            <path d="M100,100 L300,100 L300,300 L500,300 L500,150 L700,150"
                                stroke="url(#circuitGradient)" strokeWidth="2" fill="none" className="animate-pulse" />
                            <path d="M200,400 L400,400 L400,600 L600,600 L600,450 L800,450"
                                stroke="url(#circuitGradient)" strokeWidth="2" fill="none" className="animate-pulse delay-300" />
                            <circle cx="300" cy="100" r="4" fill="#79e708" className="animate-pulse" />
                            <circle cx="500" cy="300" r="4" fill="#79e708" className="animate-pulse delay-500" />
                            <circle cx="600" cy="600" r="4" fill="#79e708" className="animate-pulse delay-700" />
                        </svg>
                    </div>
                </div>

                <div className="relative z-10 px-6 py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-8">
                            <h1 className="flex items-center gap-4 text-6xl lg:text-7xl font-black tracking-tight">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#79e708] to-[#5bb406] rounded-2xl shadow-2xl shadow-[#79e708]/30">
                                    <span className="text-3xl font-black text-black">AI</span>
                                </div>
                                <span className="bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
                                    Resume Ranker
                                </span>
                            </h1>
                        </div>

                        <p className="text-xl text-gray-400 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
                            Next-generation AI recruitment platform. Intelligent resume analysis with
                            <span className="text-[#79e708] font-semibold"> custom weighting algorithms</span> and
                            <span className="text-[#79e708] font-semibold"> real-time scoring</span>.
                        </p>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-[#79e708]/20 rounded-3xl p-8 text-center hover:border-[#79e708]/40 hover:-translate-y-3 hover:scale-105 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#79e708]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#79e708]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>

                                    <div className="relative z-10">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#79e708]/20 to-[#79e708]/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-2xl">{feature.icon}</span>
                                        </div>

                                        <div className="text-[#79e708] text-2xl font-black mb-2">
                                            {feature.title}
                                        </div>
                                        <div className="text-white text-lg font-bold mb-3">
                                            {feature.subtitle}
                                        </div>
                                        <div className="text-gray-400 text-sm leading-relaxed">
                                            {feature.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="max-w-5xl mx-auto mb-12 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-2xl border border-[#79e708]/30 rounded-3xl p-10 shadow-2xl relative group overflow-hidden">
                        {/* Animated border glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#79e708]/20 via-transparent to-[#79e708]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                        <div className="relative z-10">
                            {/* Job Description */}
                            <div className="mb-8">
                                <label className="flex items-center text-[#79e708] text-lg font-bold mb-4">
                                    <span className="mr-3">📋</span>
                                    Job Description
                                </label>
                                <textarea
                                    value={jdText}
                                    onChange={(e) => setJdText(e.target.value)}
                                    className="w-full bg-black/50 border-2 border-gray-800 rounded-2xl p-6 text-white placeholder-gray-500 focus:outline-none focus:border-[#79e708] focus:ring-4 focus:ring-[#79e708]/20 focus:scale-[1.01] transition-all duration-300 backdrop-blur-sm resize-none text-base"
                                    rows={8}
                                    placeholder="Paste your complete job description here. Include required skills, experience level, and key responsibilities..."
                                />
                            </div>

                            {/* Skills Input */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="flex items-center text-[#79e708] text-lg font-bold mb-4">
                                        <span className="mr-3">🔧</span>
                                        Technical Skills
                                    </label>
                                    <input
                                        type="text"
                                        value={techSkills}
                                        onChange={(e) => setTechSkills(e.target.value)}
                                        placeholder="python, javascript, react, sql, aws..."
                                        className="w-full bg-black/50 border-2 border-gray-800 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#79e708] focus:ring-4 focus:ring-[#79e708]/20 focus:scale-[1.01] transition-all duration-300 backdrop-blur-sm"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center text-[#79e708] text-lg font-bold mb-4">
                                        <span className="mr-3">💡</span>
                                        Soft Skills
                                    </label>
                                    <input
                                        type="text"
                                        value={softSkills}
                                        onChange={(e) => setSoftSkills(e.target.value)}
                                        placeholder="leadership, communication, problem-solving..."
                                        className="w-full bg-black/50 border-2 border-gray-800 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#79e708] focus:ring-4 focus:ring-[#79e708]/20 focus:scale-[1.01] transition-all duration-300 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            {/* Top N Results */}
                            <div className="mb-8">
                                <label className="flex items-center text-[#79e708] text-lg font-bold mb-4">
                                    <span className="mr-3">🎯</span>
                                    Top N Results (Optional)
                                </label>
                                <div className="max-w-xs">
                                    <input
                                        type="number"
                                        min={1}
                                        value={topN}
                                        onChange={(e) => setTopN(e.target.value)}
                                        placeholder="e.g., 50"
                                        className="w-full bg-black/50 border-2 border-gray-800 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#79e708] focus:ring-4 focus:ring-[#79e708]/20 focus:scale-[1.01] transition-all duration-300 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            {/* Custom Weights Section */}
                            <div className="bg-gradient-to-br from-gray-800/30 to-black/30 border border-[#79e708]/20 rounded-3xl p-8 mb-8 backdrop-blur-sm">
                                <h3 className="flex items-center text-[#79e708] text-2xl font-black mb-6">
                                    <span className="mr-3">⚖️</span>
                                    AI Weight Configuration
                                </h3>
                                <p className="text-gray-400 mb-6">Fine-tune the importance of each evaluation criteria (0.0 - 1.0)</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {weightControls.map((w, i) => (
                                        <div key={i} className="group bg-black/20 border border-gray-700 rounded-2xl p-6 hover:border-[#79e708]/40 hover:bg-[#79e708]/5 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <span className="text-xl mr-3">{w.icon}</span>
                                                    <label className="text-white font-semibold">
                                                        {w.label}
                                                    </label>
                                                </div>
                                            </div>
                                            <input
                                                type="number"
                                                min={0}
                                                max={1}
                                                step={0.1}
                                                value={w.value}
                                                onChange={(e) => w.set(parseFloat(e.target.value || "0"))}
                                                className="w-full bg-black/50 border-2 border-gray-800 rounded-xl p-3 text-white text-center font-bold focus:outline-none focus:border-[#79e708] focus:ring-2 focus:ring-[#79e708]/20 transition-all duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="border-2 border-dashed border-[#79e708]/40 rounded-3xl p-12 text-center hover:border-[#79e708]/60 hover:bg-[#79e708]/5 hover:scale-[1.01] transition-all duration-300 mb-8 relative overflow-hidden group">
                                {/* Pulse animation background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#79e708]/5 via-[#79e708]/10 to-[#79e708]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#79e708]/20 to-[#79e708]/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl">📁</span>
                                    </div>

                                    <h3 className="text-[#79e708] text-2xl font-black mb-3">
                                        Upload Resume Files
                                    </h3>
                                    <p className="text-gray-400 mb-6 text-lg">
                                        Drag & drop or click to select PDF and DOCX files
                                    </p>

                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleUpload}
                                        className="w-full text-gray-300 file:mr-6 file:py-4 file:px-8 file:rounded-full file:border-0 file:font-bold file:bg-gradient-to-r file:from-[#79e708] file:to-[#5bb406] file:text-black hover:file:from-[#5bb406] hover:file:to-[#79e708] file:transition-all file:duration-300 file:cursor-pointer file:shadow-xl hover:file:shadow-[#79e708]/30 hover:file:-translate-y-1"
                                        accept=".pdf,.docx"
                                    />

                                    {resumes && resumes.length > 0 && (
                                        <div className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#79e708]/20 to-[#79e708]/10 text-[#79e708] rounded-2xl font-bold border border-[#79e708]/30 shadow-lg">
                                            <span className="mr-2">✅</span>
                                            {resumes.length} file{resumes.length > 1 ? 's' : ''} ready for analysis
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Analyze Button */}
                            <div className="text-center">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                    className="group relative bg-gradient-to-r from-[#79e708] to-[#5bb406] text-black px-12 py-5 rounded-full text-xl font-black hover:from-[#5bb406] hover:to-[#79e708] hover:-translate-y-2 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#79e708]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mx-auto overflow-hidden"
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                                    <div className="relative z-10 flex items-center gap-3">
                                        {loading ? (
                                            <>
                                                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                Processing AI Analysis...
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-2xl">🚀</span>
                                                Start AI Analysis
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    {results.length > 0 && (
                        <div className="max-w-7xl mx-auto bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-2xl border border-[#79e708]/30 rounded-3xl p-10 shadow-2xl">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                                <div>
                                    <h3 className="flex items-center text-[#79e708] text-3xl font-black mb-2">
                                        <span className="mr-4">🏆</span>
                                        AI Analysis Results
                                    </h3>
                                    <p className="text-gray-400 text-lg">
                                        {results.length} candidates ranked by AI intelligence
                                    </p>
                                </div>

                                <button
                                    onClick={downloadCSV}
                                    className="group bg-gradient-to-r from-[#79e708]/20 to-[#79e708]/10 border-2 border-[#79e708]/30 text-[#79e708] px-8 py-4 rounded-2xl font-bold hover:bg-gradient-to-r hover:from-[#79e708]/30 hover:to-[#79e708]/20 hover:border-[#79e708]/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-[#79e708]/20"
                                >
                                    <span className="text-xl">📥</span>
                                    Export CSV
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border-2 border-[#79e708]/20 bg-black/40 backdrop-blur-sm">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-[#79e708]/20 to-[#79e708]/10 border-b-2 border-[#79e708]/20">
                                            <th className="text-[#79e708] p-6 text-left font-black text-lg">Rank</th>
                                            <th className="text-[#79e708] p-6 text-left font-black text-lg">Candidate Profile</th>
                                            <th className="text-[#79e708] p-6 text-center font-black text-lg">AI Score</th>
                                            <th className="text-[#79e708] p-6 text-center font-black text-lg">Resume File</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((res, idx) => (
                                            <tr key={idx} className="border-b border-gray-800/50 hover:bg-[#79e708]/5 hover:scale-[1.005] transition-all duration-300 group">
                                                <td className="p-6">
                                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-lg ${getRankBadgeStyle(idx)}`}>
                                                        #{idx + 1}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div>
                                                        <div className="text-white font-bold text-lg mb-2 group-hover:text-[#79e708] transition-colors">
                                                            {res.candidate_name}
                                                        </div>
                                                        <div className="text-gray-400 text-sm">
                                                            {res.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#79e708] to-[#5bb406] text-black font-black text-lg rounded-2xl shadow-xl">
                                                        {res.final_score}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="text-gray-400 text-sm bg-gray-800/30 px-4 py-2 rounded-lg max-w-48 truncate mx-auto" title={res.file_name}>
                                                        {res.file_name}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResumeRanker;
