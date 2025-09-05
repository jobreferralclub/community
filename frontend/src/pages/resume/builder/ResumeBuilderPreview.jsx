import { useEffect, useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

import PersonalInfo from "../../../components/resume/builder/PersonalInfo";
import ExperienceInfo from "../../../components/resume/builder/ExperienceInfo";
import EducationInfo from "../../../components/resume/builder/EducationInfo";
import SkillsInfo from "../../../components/resume/builder/SkillsInfo";
import ProjectsInfo from "../../../components/resume/builder/ProjectsInfo";
import LivePreview from "../../../components/resume/builder/LivePreview";
import ResumeDownloadButton from "../../../components/resume/builder/ResumeDownloadButton";
import TemplateSelectionPopup from "../../../components/resume/builder/TemplateSelectionPopup";

import useTemplateStore from "@/store/useTemplateStore";
import { useAuthStore } from "@/store/authStore";

const sections = [
  "Personal Info",
  "Experience",
  "Education",
  "Skills",
  "Projects",
  "Preview Resume",
];

const ResumeBuilderPreview = () => {
  const [animateIn, setAnimateIn] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTemplatePopup, setShowTemplatePopup] = useState(false);
  const [popupShownOnce, setPopupShownOnce] = useState(false);

  const currentTemplate = useTemplateStore((state) => state.currentTemplate);
  const { user } = useAuthStore(); // ✅ get auth user
  console.log(user);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateIn(true);
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!popupShownOnce && !currentTemplate) {
      setShowTemplatePopup(true);
      setPopupShownOnce(true);
    }
  }, [currentTemplate, popupShownOnce]);

  // ✅ Pass user data as props to each section for prefill
  const renderSection = () => {
    switch (sections[currentStep]) {
      case "Personal Info":
        return <PersonalInfo data={user} />;
      case "Experience":
        return <ExperienceInfo data={user?.work || []} />;
      case "Education":
        return <EducationInfo data={user?.education || []} />;
      case "Skills":
        return <SkillsInfo data={user?.skills || []} />;
      case "Projects":
        return <ProjectsInfo data={user?.projects || []} />;
      case "Preview Resume":
        return (
          <div className="flex flex-col items-center justify-center w-1/2 mx-auto">
            <LivePreview user={user} />
            <div className="mt-4">
              <ResumeDownloadButton />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {showTemplatePopup && <TemplateSelectionPopup />}
      <div
        className={`mx-auto transition-all duration-500 ease-out transform ${
          animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start min-h-screen">
          {/* Left Side (Sidebar + Form) */}
          <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-900 flex-grow">
            {/* Sidebar */}
            <div className="w-full lg:w-1/4 border-r border-gray-800 bg-gray-900 rounded-lg p-4">
              <h1 className="text-3xl font-bold mb-1">AI Resume Builder</h1>
              <p className="text-sm text-gray-400 mb-6">by JobReferral.Club</p>
              <div className="flex flex-col space-y-6">
                {sections.map((section, index) => {
                  const isCompleted = index < currentStep;
                  const isActive = index === currentStep;
                  return (
                    <div
                      key={section}
                      onClick={() => setCurrentStep(index)}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      {isCompleted ? (
                        <CheckCircle className="text-[#79e708]" />
                      ) : isActive ? (
                        <Circle className="text-white" />
                      ) : (
                        <Circle className="text-gray-600" />
                      )}
                      <span
                        className={`text-sm ${
                          isCompleted || isActive
                            ? "text-white font-medium"
                            : "text-gray-500 group-hover:text-white"
                        }`}
                      >
                        {section}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section Form */}
            <div className="flex-1 w-full flex flex-col">
              <div className="rounded-lg shadow-lg border bg-gray-900 border-gray-800 p-6 flex-grow">
                {renderSection()}
                {currentStep < sections.length - 1 && (
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className="px-4 py-2 rounded-md bg-[#79e708] text-black font-medium hover:bg-lime-400 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Live Preview (Only shown when not in final step) */}
          {sections[currentStep] !== "Preview Resume" && (
            <div className="w-full lg:w-auto lg:min-w-[450px] lg:max-w-[540px] xl:min-w-[520px] xl:max-w-[620px] sticky top-0">
              <div className="">
                <div className="rounded-lg shadow-lg border border-gray-800">
                  <div className="bg-gradient-to-r to-black from-gray-900 rounded-t-lg p-4 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <span className="w-3 h-3 bg-[#79e708] rounded-full mr-3"></span>
                      Live Preview
                    </h2>
                  </div>
                  <div className="flex justify-center items-center p-4 bg-gradient-to-r to-black from-gray-900">
                    <LivePreview user={user} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPreview;
