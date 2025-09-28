import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeIcon from "../../common/SafeIcon";
import * as FiIcons from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { subCommunities } from "../../data/communityList";
import { useAuthStore } from "../../store/authStore";

const { FiMenu, FiSearch, FiHelpCircle, FiBookOpen, FiBell } = FiIcons;

const CommunityHeader = ({ onMenuClick }) => {
    const { user, setUser } = useAuthStore();
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_PORT || "http://localhost:5000";

    const [searchTerm, setSearchTerm] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchSubmitted, setSearchSubmitted] = useState(false);
    const [postResults, setPostResults] = useState([]);

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [seenAcknowledged, setSeenAcknowledged] = useState(false);

    const notifications = user?.notifications || [];
    const hasUnseen = notifications.some(n => !n.seen);


    // Fetch posts when Enter is pressed
    useEffect(() => {
        if (!searchSubmitted || !searchTerm.trim()) return;

        async function fetchPosts() {
            try {
                const res = await fetch(
                    `${apiBaseUrl}/api/search?q=${encodeURIComponent(searchTerm)}`
                );
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

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setSearchSubmitted(true);
        }
    };

    // Base search data (tools + communities)
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

    const filteredResults = baseSearchData.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-black border-b border-zinc-800 py-4 shadow-md transition-all duration-200"
        >
            <div className="flex items-center justify-between gap-4">
                {/* Left Section: Menu + Search */}
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                        <SafeIcon icon={FiMenu} className="w-5 h-5 text-gray-300" />
                    </button>

                    {/* Search */}
                    <div className="relative flex-1">
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

                        {/* Search results dropdown */}
                        {showSearchResults && searchTerm && (
                            <>
                                {/* Overlay */}
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
                                            {/* Local results */}
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
                                                    {item.name}{" "}
                                                    <span className="text-green-500">in {item.type}</span>
                                                </button>
                                            ))}

                                            {/* Post results */}
                                            {postResults.slice(0, 5).map((post) => {
                                                const matchedCommunity = subCommunities.find((c) =>
                                                    c.title.toLowerCase().includes(post.community.toLowerCase())
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
                                                                <span className="text-xs text-gray-500">
                                                                    · {post.community}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-400 line-clamp-1">
                                                                {post.snippet}
                                                            </p>
                                                        </div>

                                                        <span className="text-xs text-blue-400 font-medium">
                                                            Post
                                                        </span>
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

                {/* Right Section: Ask + Guidelines + Notifications */}
                <div className="flex items-center gap-4 relative">
                    {/* Notifications */}
                    <div className="relative group">
                        <button
                            onClick={async () => {
                                setNotificationsOpen((prev) => !prev);

                                // Mark all unseen notifications as "acknowledged" locally when opening
                                if (!notificationsOpen && hasUnseen) {
                                    setSeenAcknowledged(true);

                                    // Optional: still call backend to mark seen
                                    try {
                                        await fetch(`${apiBaseUrl}/api/notifications/mark-seen`, {
                                            method: "PATCH",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ userId: user._id }),
                                        });
                                    } catch (err) {
                                        console.error("Failed to mark notifications as seen:", err);
                                    }
                                }
                            }}
                            className="p-2 rounded-lg hover:bg-zinc-900 transition-colors relative"
                        >
                            <SafeIcon icon={FiBell} className="w-5 h-5 text-[#79e708]" />

                            {/* Show red dot only if there’s any unseen notification AND not acknowledged */}
                            {hasUnseen && !seenAcknowledged && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </button>

                        {/* Tooltip */}
                        <span
                            className={`absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-gray-200 text-xs rounded px-2 py-1 transition-opacity pointer-events-none
      ${!notificationsOpen ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`}
                        >
                            Notifications
                        </span>

                        <AnimatePresence>
                            {notificationsOpen && (
                                <>
                                    {/* Overlay */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setNotificationsOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-80 max-h-96 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-20 overflow-y-auto"
                                    >
                                        {notifications.length > 0 ? (
                                            // Sort latest first
                                            [...notifications]
                                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                                .map((n) => (
                                                    <button
                                                        key={n.id}
                                                        onClick={() => {
                                                            navigate(n.link);
                                                            setNotificationsOpen(false);
                                                        }}
                                                        className={`flex items-start w-full text-left px-4 py-3 transition-colors border-b border-zinc-800 ${!n.seen ? "bg-zinc-800 font-semibold" : "hover:bg-gray-800"
                                                            }`}
                                                    >
                                                        {/* Red dot for unseen */}
                                                        {!n.seen && (
                                                            <span className="w-2 h-2 mt-1 mr-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                                                        )}

                                                        <div className="flex-1">
                                                            <p className={`text-gray-200 ${!n.seen ? "text-green-400" : ""}`}>{n.title}</p>
                                                            {n.description && (
                                                                <p className={`text-sm ${!n.seen ? "text-green-300" : "text-gray-400"}`}>{n.description}</p>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))
                                        ) : (
                                            <p className="px-4 py-3 text-sm text-gray-500 text-center">No notifications to show</p>
                                        )}


                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>


                    {/* Ask the Community */}
                    <button
                        onClick={() => navigate("/community/ask-the-community")}
                        className="p-2 rounded-lg hover:bg-zinc-900 transition-colors flex items-center space-x-2"
                    >
                        <SafeIcon icon={FiHelpCircle} className="w-5 h-5 text-[#79e708]" />
                        <span className="hidden sm:inline text-sm font-medium text-gray-300">
                            Ask the Community
                        </span>
                    </button>

                    {/* Announcements */}
                    <button
                        onClick={() => navigate("/community/announcements")}
                        className="p-2 rounded-lg hover:bg-zinc-900 transition-colors flex items-center space-x-2"
                    >
                        <SafeIcon icon={FiIcons.FiVolume2} className="w-5 h-5 text-[#79e708]" />
                        <span className="hidden sm:inline text-sm font-medium text-gray-300">
                            Announcements
                        </span>
                    </button>
                </div>
            </div>
        </motion.header>
    );
};

export default CommunityHeader;
