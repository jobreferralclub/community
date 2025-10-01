import React from "react";
import { Link } from "react-router-dom";
import SafeIcon from "../common/SafeIcon";
import * as FiIcons from "react-icons/fi";

const SuccessStories = () => {
  const dummyStories = [
    {
      id: 1,
      title: "Landed Job via Referral in 2 Weeks",
      author: "Alice Johnson",
      snippet:
        "I applied through the JobReferral.Club platform and got connected with a referral. The interview process was smooth and I got the offer in just 2 weeks!",
    },
    {
      id: 2,
      title: "From Fresher to Product Manager",
      author: "Ravi Kumar",
      snippet:
        "Using the resume builder and mock interviews really helped me craft my profile and ace the interviews.",
    },
    {
      id: 3,
      title: "Switching Careers Successfully",
      author: "Priya Sharma",
      snippet:
        "The resume ranker gave me insights into how my resume could be improved. I got hired in a completely different domain successfully!",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800/50 shadow-md p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Success Stories
        </h1>
        <Link
          to="/"
          className="text-[#79e708] hover:text-white transition-colors font-medium"
        >
          Back to Home
        </Link>
      </header>

      {/* Stories List */}
      <main className="p-6 max-w-4xl mx-auto">
        {dummyStories.map((story) => (
          <div
            key={story.id}
            className="bg-zinc-900 border border-gray-800 rounded-lg p-4 mb-4 hover:border-[#79e708] transition-colors"
          >
            <h2 className="text-xl font-semibold text-[#79e708] mb-2">
              {story.title}
            </h2>
            <p className="text-gray-400 text-sm mb-2">by {story.author}</p>
            <p className="text-gray-300">{story.snippet}</p>
            <button className="mt-3 px-3 py-1 bg-[#79e708] text-black rounded hover:bg-green-400 transition-colors text-sm font-medium">
              Read More
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default SuccessStories;
