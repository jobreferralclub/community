import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from MockInterviewer navigate()
  const { questions = [], resume = "", jobDescription="" } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="mb-4">⚠️ No questions found. Please start again.</p>
          <Button onClick={() => navigate("/mock-interviewer")}>
            Back to Mock Interviewer
          </Button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      alert("Please enter your answer before continuing.");
      return;
    }

    setAnswers((prev) => [...prev, currentAnswer]);
    setCurrentAnswer("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // End of interview
      navigate("/mock-interviewer/summary", {
        state: { questions, answers: [...answers, currentAnswer], resume, jobDescription },
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-gray-900/70 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-[#79e708]">
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <p className="text-lg mb-6">{questions[currentIndex]}</p>

        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-40 p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#79e708] resize-none mb-6"
        />

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            className="px-6 py-3 bg-[#79e708] text-black font-semibold rounded-xl hover:bg-[#5bb406] transition"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "Finish"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Interview;
