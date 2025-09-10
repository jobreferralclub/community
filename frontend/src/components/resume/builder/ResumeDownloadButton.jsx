import React from "react";
import { Download } from "lucide-react";

const ResumeDownloadButton = () => {
  const apiUrl = import.meta.env.VITE_API_PORT;

  const downloadPDF = async () => {
    const element = document.getElementById("resume-preview");

    if (!element) {
      console.error("Resume preview element not found.");
      return;
    }

    const content = element.innerHTML;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Resume PDF</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body {
              font-family: 'Helvetica', sans-serif;
              padding: 2rem;
              background-color: white;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

    console.log(element);
    console.log(content);
    console.log(html);

    try {
      const response = await fetch(`${apiUrl}/api/resume/generate-resume-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <button
      onClick={downloadPDF}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-emerald-600 hover:to-green-700 transition-all duration-200 cursor-pointer"
    >
      <Download size={18} />
      Download PDF
    </button>
  );
};

export default ResumeDownloadButton;
