import React from "react";
import { FileText, Download, Upload } from "lucide-react";

export default function LinkedInExportGuide() {
  const steps = [
    {
      id: 1,
      icon: <FileText className="w-6 h-6 text-lime-400" />,
      title: "Go to your LinkedIn profile page",
      image: "/images/step1-profile-page.png",
    },
    {
      id: 2,
      icon: <Download className="w-6 h-6 text-lime-400" />,
      title: "Click the More / Resources button under your profile header",
      image: "/images/step2-more-button.png",
    },
    {
      id: 3,
      icon: <FileText className="w-6 h-6 text-lime-400" />,
      title: "Select Save to PDF from the dropdown menu",
      image: "/images/step3-save-to-pdf.png",
    },
    {
      id: 4,
      icon: <Upload className="w-6 h-6 text-lime-400" />,
      title: "Upload that PDF here to format your resume",
      image: null,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 mb-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white text-center mb-8 bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
        📄 How to Export Your LinkedIn Resume
      </h2>

      <div className="relative flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {steps.map((step) => (
          <div
            key={step.id}
            className="group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:border-lime-400/50 hover:shadow-lime-400/10 transition-all"
          >
            {/* Step Number */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-lime-400 to-green-500 text-black font-bold rounded-full shadow-lg border border-white/20">
              {step.id}
            </div>

            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center bg-lime-400/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
              {step.icon}
            </div>

            {/* Title */}
            <p className="text-white font-medium mb-4">{step.title}</p>

          </div>
        ))}
      </div>
    </div>
  );
}
