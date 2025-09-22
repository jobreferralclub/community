import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SafeIcon from "../../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { subCommunities } from "../../data/communityList";

const { FiMenu, FiBell, FiSearch, FiAward, FiLogOut, FiUser, FiHelpCircle } = FiIcons;

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { logout: auth0logout } = useAuth0();
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_PORT || "http://localhost:5000";

   // =======================
  // Gamification logic (commented out for now)

  // const [points, setPoints] = useState(user?.points || 0);

  // useEffect(() => {
  //   if (!user?._id) return;

  //   fetch(`${apiBaseUrl}/api/users/${user._id}/gamification`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPoints(data.totalPoints);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch gamification points:", err);
  //     });
  // }, [user?._id, apiBaseUrl]);

  // =======================

  const [points, setPoints] = useState(user?.points || 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [postResults, setPostResults] = useState([]);

  useEffect(() => {
    if (!searchSubmitted || !searchTerm.trim()) return;

    async function fetchPosts() {
      try {
        const res = await fetch(`${apiBaseUrl}/api/search?q=${encodeURIComponent(searchTerm)}`);
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPostResults(data.results || []);
      } catch (err) {
        console.error("Failed to search posts:", err);
        setPostResults([]);
      }
    }

    fetchPosts();
  }, [searchSubmitted, searchTerm, apiBaseUrl]);

  useEffect(() => {
    if (!user?._id) return;

    fetch(`${apiBaseUrl}/api/users/${user._id}/gamification`)
      .then((res) => res.json())
      .then((data) => {
        setPoints(data.totalPoints);
      })
      .catch((err) => {
        console.error("Failed to fetch gamification points:", err);
      });
  }, [user?._id, apiBaseUrl]);

  const baseSearchData = [
    { name: "Mock Interviewer", type: "Free Tools", url: "/mock-interviewer" },
    { name: "Resume Builder", type: "Free Tools", url: "/resume-builder" },
    { name: "Resume Ranker", type: "Free Tools", url: "/resume-ranker" },
    { name: "Resume Analyzer", type: "Free Tools", url: "/resume-analyzer" },
    { name: "Profile", type: "User Profile", url: "/profile" },
    { name: "Settings", type: "Community", url: "/community/settings" },

    ...subCommunities.map((c) => {
      const regionMatch = c.title.match(/- (.*)$/);
      const region = regionMatch ? regionMatch[1] : "";

      const nameMatch = c.title.match(/^(.*?)\s*-/);
      const name = nameMatch ? nameMatch[1].trim() : c.title;

      return {
        name,
        type: region ? `Community (${region})` : "Community",
        url: c.path,
      };
    }),
  ];

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchSubmitted(true);
    }
  };

  const searchData = [...baseSearchData];

  const filteredResults = searchData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = 0; // Not used since bell redirects immediately

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-black border-b border-zinc-800 px-6 py-4 shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-900 transition-colors"
          >
            <SafeIcon icon={FiMenu} className="w-5 h-5 text-gray-300" />
          </button>

          <div className="relative hidden md:block flex-1">
            <SafeIcon
              icon={FiSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchResults(true);
                setSearchSubmitted(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search community, tools, users..."
              className="pl-10 pr-4 py-2 w-full rounded-s rounded-e border border-zinc-800 bg-zinc-900 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-[#79e708] focus:border-transparent transition-all"
            />

            {showSearchResults && searchTerm && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-10"
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchSubmitted(false);
                  }}
                />

                <div className="absolute mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                  {!searchSubmitted ? (
                    <button
                      type="button"
                      onClick={() => setSearchSubmitted(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      Search for: <span className="font-medium">{searchTerm}</span>{" "}
                      <span className="text-gray-500">(Press Enter)</span>
                    </button>
                  ) : filteredResults.length > 0 || postResults.length > 0 ? (
                    <>
                      {filteredResults.slice(0, 5).map((item, index) => (
                        <button
                          key={`local-${index}`}
                          type="button"
                          onClick={() => {
                            navigate(item.url);
                            setSearchTerm("");
                            setShowSearchResults(false);
                            setSearchSubmitted(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                        >
                          {item.name} <span className="text-green-500">in {item.type}</span>
                        </button>
                      ))}

                      {postResults.slice(0, 5).map((post) => {
                        const matchedCommunity = subCommunities.find(
                          (c) => c.title.toLowerCase().includes(post.community.toLowerCase())
                        );
                        const communityPath = matchedCommunity ? matchedCommunity.path : "/general";

                        const customUrl = `${communityPath}?postid=${post.id}`;

                        return (
                          <button
                            key={post.id}
                            type="button"
                            onClick={() => {
                              navigate(customUrl);
                              setSearchTerm("");
                              setShowSearchResults(false);
                              setSearchSubmitted(false);
                            }}
                            className="w-full text-left p-3 flex items-start gap-3 hover:bg-gray-800 transition-colors border-b border-zinc-800"
                          >
                            <img
                              src={post.author?.avatar || "/default-avatar.png"}
                              alt={post.author?.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-200">
                                  {post.author?.name}
                                </span>
                                <span className="text-xs text-gray-500">· {post.community}</span>
                              </div>

                              <p className="text-sm text-gray-400 line-clamp-1">{post.snippet}</p>
                            </div>

                            <span className="text-xs text-blue-400 font-medium">Post</span>
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">No results found</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4 relative">
          {/* Points display (commented out) */}
  {/* 
  <div className="hidden sm:flex items-center space-x-2 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
    <SafeIcon icon={FiAward} className="w-4 h-4 text-[#79e708]" />
    <span className="text-sm font-medium text-gray-300">{points} pts</span>
  </div>
  */}
          {/* Bell icon redirects directly to announcements */}
          <button
            onClick={() => navigate("/community/announcements")}
            className="p-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center"
            aria-label="Announcements"
          >
            <SafeIcon icon={FiBell} className="w-6 h-6 text-white" />
          </button>

          {/* Ask the community icon */}
          <button
            onClick={() => navigate("/community/ask-the-community")}
            className="p-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center"
            aria-label="Ask the community"
          >
            <SafeIcon icon={FiHelpCircle} className="w-6 h-6 text-white" />
          </button>

          {/* Profile */}
          <div className="relative group">
            <div className="flex items-center space-x-3 cursor-pointer">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#79e708]/40"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-300">{user.name}</p>
              </div>
            </div>

            <div className="absolute right-0 top-6 w-40 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all z-20 pointer-events-none group-hover:pointer-events-auto">
              <button
                onClick={() => {
                  logout();
                  auth0logout({ returnTo: "/" });
                  navigate("/");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
              >
                <SafeIcon icon={FiLogOut} className="w-4 h-4 text-gray-400" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
