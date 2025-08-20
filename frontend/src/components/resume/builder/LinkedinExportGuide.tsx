import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Download, Upload } from 'lucide-react';

export default function LinkedInExportGuide() {
    const [open, setOpen] = useState(false);

    const steps = [
        {
            id: 1,
            icon: <FileText className="w-5 h-5" />,
            title: "Go to your LinkedIn profile page.",
            image: "/images/step1-profile-page.png"
        },
        {
            id: 2,
            icon: <Download className="w-5 h-5" />,
            title: 'Click the "More" or "Resources" button under your profile header.',
            image: "/images/step2-more-button.png"
        },
        {
            id: 3,
            icon: <FileText className="w-5 h-5" />,
            title: 'Select "Save to PDF" from the dropdown menu.',
            image: "/images/step3-save-to-pdf.png"
        },
        {
            id: 4,
            icon: <Upload className="w-5 h-5" />,
            title: "Upload that downloaded PDF here to format your resume.",
            image: null
        }
    ];

    return (
        <div className="bg-black border border-gray-800 rounded-2xl p-6">
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between text-white font-semibold text-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded-xl transition-all"
            >
                <span>📄 How to Export Your LinkedIn Resume</span>
                {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {/* Dropdown Content */}
            {open && (
                <div className="mt-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6 relative overflow-x-auto">
                        {steps.map((step) => (
                            <div key={step.id} className="relative z-10 flex flex-col items-center text-center flex-1 max-w-xs min-w-[220px]">
                                {/* Step Circle */}
                                <div className="w-10 h-10 flex items-center justify-center bg-[#79e708] text-black font-bold rounded-full border-2 border-[#79e708]/20 shadow-lg mb-4">
                                    {step.id}
                                </div>

                                {/* Step Content */}
                                <div className="space-y-3">
                                    <p className="text-white font-medium leading-relaxed">
                                        {step.title}
                                    </p>

                                    {/* Image */}
                                    {step.image ? (
                                        <img
                                            src={step.image}
                                            alt={`Step ${step.id}`}
                                            className="rounded-xl border border-gray-700 shadow-md w-full max-w-full object-contain"
                                        />
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
