import { subCommunities } from "./communityList"; // adjust path if needed

export const searchData = [
  // Static items
  { name: "Mock Interviewer", type: "Free Tools", url: "/mock-interviewer" },
  { name: "Resume Builder", type: "Free Tools", url: "/resume-builder" },
  { name: "Resume Ranker", type: "Free Tools", url: "/resume-ranker" },
  { name: "Resume Analyzer", type: "Free Tools", url: "/resume-analyzer" },
  { name: "Profile", type: "User Profile", url: "/profile" },
  { name: "Settings", type: "Community", url: "/community/settings" },

  // Dynamically map subCommunities into the same shape
  ...subCommunities.map((c) => {
    // Extract "India", "US", etc. from the title (after the last "-")
    const regionMatch = c.title.match(/- (.*)$/);
    const region = regionMatch ? regionMatch[1] : "";

    // Extract "Operations & Supply Chain" etc. before the dash
    const nameMatch = c.title.match(/^(.*?)\s*-/);
    const name = nameMatch ? nameMatch[1].trim() : c.title;

    return {
      name,                   // e.g. "Operations & Supply Chain"
      type: region ? `Community (${region})` : "Community", // e.g. "Community (India)"
      url: c.path             // keep the path
    };
  }),
];
