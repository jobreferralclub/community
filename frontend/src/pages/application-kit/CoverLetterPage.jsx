import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navigation from "../../components/landing/Navigation";
import toast from 'react-hot-toast';

import { useState, useEffect } from "react";
import Footer from "../../components/landing/Footer";

export default function CoverLetterPage() {
    const [letterData, setLetterData] = useState({
        coverLetter: "",
        companyName: "Unknown Company",
        jobTitle: "Job Title",
    });

    useEffect(() => {
        const storedData = localStorage.getItem("coverLetterData");
        if (storedData) {
            let data = JSON.parse(storedData);
            let cleanText = data.coverLetter;

            // Remove ``` backticks
            cleanText = cleanText.replace(/```/g, "");

            // Remove any literal 'html' at the start (case-insensitive)
            cleanText = cleanText.replace(/^html\s*/i, "");

            // Trim extra whitespace
            cleanText = cleanText.trim();

            setLetterData({
                ...data,
                coverLetter: cleanText,
            });
        }
    }, []);

    const { coverLetter, companyName, jobTitle } = letterData;
    const [letter, setLetter] = useState("");

    // Sync letter state with loaded coverLetter
    useEffect(() => {
        setLetter(coverLetter);
    }, [coverLetter]);

    const handleCopy = () => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = letter;

        // Replace <br> with newline
        tempElement.querySelectorAll("br").forEach(br => br.replaceWith("\n"));

        // Add newline before and after <p>
        tempElement.querySelectorAll("p").forEach(p => {
            p.insertAdjacentText("beforebegin", "\n");
            p.insertAdjacentText("afterend", "\n");
        });

        // Convert list items to bullets
        tempElement.querySelectorAll("li").forEach(li => {
            li.insertAdjacentText("beforebegin", "• ");
            li.insertAdjacentText("afterend", "\n");
        });

        const plainText = tempElement.innerText
            .replace(/\n\s*\n\s*\n/g, "\n\n") // collapse extra blank lines
            .trim();

        navigator.clipboard.writeText(plainText);
        toast.success("Letter copied with formatting!");
    };

    return (
        <div className="flex flex-col min-h-screen bg-black relative overflow-hidden">
            {/* Header Bar */}
            <Navigation />

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
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#79e708]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#79e708]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#79e708]/6 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex justify-center py-16 px-4">
                <Card className="w-full max-w-3xl bg-white text-black shadow-2xl rounded-s rounded-e border border-gray-200">
                    <CardContent className="relative p-10">
                        {/* Copy Button (top right) */}
                        <button
                            onClick={handleCopy}
                            className="absolute top-6 right-6 px-4 py-2 rounded-s rounded-e text-sm font-semibold bg-gradient-to-r from-[#79e708] to-[#5bb406] text-black hover:shadow-lg hover:shadow-[#79e708]/30 transition-all"
                        >
                            Copy Letter
                        </button>

                        {/* Heading */}
                        <h2 className="text-xl font-bold text-center mb-6">
                            {companyName || "Unknown Company"} – {jobTitle || "Job Title"}
                        </h2>

                        <style>
                            {`
      .custom-quill .ql-editor p {
        font-size: 16px;
        font-family: Arial, sans-serif;
        line-height: 1.6;
      }
      .custom-quill .ql-editor li {
        font-size: 15px;
        font-family: Arial, sans-serif;
        line-height: 1.5;
      }
    `}
                        </style>
                        {/* Letter Content */}
                        <ReactQuill
                            theme="snow"
                            value={letter}
                            onChange={setLetter}
                            className="min-h-[500px] bg-white text-black rounded-s rounded-e"
                            style={{
                                fontSize: "16px",
                                fontFamily: "Arial, sans-serif",
                                lineHeight: "1.6",
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    );
}
