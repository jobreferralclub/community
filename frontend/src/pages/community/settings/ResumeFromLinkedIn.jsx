import React from "react";
import { UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    {
      id: 4,
      // No image, just upload action as the card body
      upload: true,
      title: "Click to upload your LinkedIn PDF",
      subtitle: "Accepted format: PDF",
      button: "Format Resume",
    }
  ];

  const CARD_MIN_HEIGHT = "min-h-[420px]";

  return (
    <div className="w-full bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 shadow-2xl">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-lg hover:border-lime-400/50 hover:shadow-lime-400/10 transition-all ${CARD_MIN_HEIGHT}`}
          >
            {/* Step Number */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-lime-400 to-green-500 text-black font-bold rounded-full shadow-lg border border-white/20">
              {step.id}
            </div>
            {/* Step Title */}
            <p className="text-white font-medium mb-4">{step.title}</p>
            {/* Step Image or Upload */}
            {step.upload ? (
              <label
                htmlFor="resumeUpload"
                className="cursor-pointer border-2 border-dashed border-lime-400/50 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-4 text-center hover:bg-lime-400/5 transition-all w-full"
              >
                <UploadCloud className="w-10 h-10 text-lime-400" />
                <span className="text-sm text-gray-400">
                  {step.subtitle}
                </span>
                <Input id="resumeUpload" type="file" accept=".pdf" className="hidden" />
                <Button className="mt-6 w-full bg-gradient-to-r from-lime-400 to-green-500 hover:brightness-110 text-black font-semibold px-6 py-2 rounded-full shadow">
                  {step.button}
                </Button>
              </label>
            ) : (
              step.image && (
                <div className="mt-auto w-full">
                  <img
                    src={step.image}
                    alt={`Step ${step.id}`}
                    className="rounded-xl border border-zinc-700 shadow-md w-full object-contain group-hover:border-lime-400/40 transition-all aspect-square bg-white"
                  />
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkedInExportGuide;
