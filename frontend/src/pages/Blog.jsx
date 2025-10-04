import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../components/landing/Navigation";
import Footer from "../components/landing/Footer";
import { useAuthStore } from "../store/authStore";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Blog = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/blogs");
                setBlogs(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } catch (err) {
                console.error("Failed to fetch blogs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const truncate = (text, maxLength) =>
        text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

    const formatDate = (dateStr) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateStr).toLocaleDateString("en-GB", options);
    };

    const latestBlogs = blogs.slice(0, 3);
    const remainingBlogs = blogs.slice(3);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/blogs/${id}`);
            setBlogs((prev) => prev.filter((b) => b._id !== id));
            alert("Blog deleted successfully!");
        } catch (err) {
            console.error("Failed to delete blog:", err);
            alert("Failed to delete blog");
        }
    };

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-black relative overflow-hidden pt-20">
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
                </div>

                {/* Content */}
                <div className="relative z-10 px-6 py-12 text-center">
                    <div className="mb-16">
                        <h1 className="text-6xl lg:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
                            Blogs & Insights
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Stay updated with{" "}
                            <span className="text-[#79e708] font-semibold">career tips</span>,{" "}
                            <span className="text-[#79e708] font-semibold">AI tools</span>, and{" "}
                            <span className="text-[#79e708] font-semibold">industry insights</span>.
                        </p>
                    </div>

                    {loading ? (
                        <p className="text-white text-lg">Loading blogs...</p>
                    ) : blogs.length === 0 ? (
                        <p className="text-white text-lg">No blogs available.</p>
                    ) : (
                        <>
                            {/* Latest 3 blogs as cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                                {latestBlogs.map((blog) => (
                                    <motion.div
                                        key={blog._id}
                                        whileHover={{ scale: 1.05 }}
                                        className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-[#79e708]/20 rounded-3xl overflow-hidden hover:border-[#79e708]/40 hover:-translate-y-3 transition-all duration-500"
                                    >
                                        {blog.coverImage && (
                                            <div
                                                className="h-48 w-full overflow-hidden cursor-pointer"
                                                onClick={() => navigate(`/blogs/${blog._id}`)}
                                            >
                                                <img
                                                    src={blog.coverImage}
                                                    alt={blog.title}
                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                        )}

                                        <div className="p-6 text-left relative z-10 flex flex-col justify-between">
                                            <div>
                                                <h3
                                                    className="text-white text-xl font-bold mb-3 group-hover:text-[#79e708] transition-colors cursor-pointer"
                                                    onClick={() => navigate(`/blogs/${blog._id}`)}
                                                >
                                                    {blog.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                                    {truncate(blog.shortDesc || blog.content, 100)}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                                <div className="flex items-center gap-2">
                                                    {blog.authorImage ? (
                                                        <img
                                                            src={blog.authorImage}
                                                            alt={blog.authorName || "Author"}
                                                            className="w-6 h-6 rounded-full object-cover border border-[#79e708]/30"
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px]">
                                                            {blog.authorName?.[0] || "A"}
                                                        </div>
                                                    )}
                                                    <span>{blog.authorName || "Unknown"}</span>
                                                </div>
                                                <span>{formatDate(blog.date)}</span>
                                            </div>

                                            {/* Admin Icons */}
                                            {user?.accountRole === "admin" && (
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <Edit
                                                        className="w-5 h-5 text-[#79e708] cursor-pointer hover:text-[#5bb406]"
                                                        onClick={() => navigate(`/blogs/editor/${blog._id}`)}
                                                    />
                                                    <Trash2
                                                        className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-400"
                                                        onClick={() => handleDelete(blog._id)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Remaining blogs as list */}
                            {remainingBlogs.length > 0 && (
                                <div className="max-w-4xl mx-auto flex flex-col gap-4">
                                    <h2 className="text-3xl font-bold text-white mb-4 text-left">
                                        Past Blogs
                                    </h2>
                                    {remainingBlogs.map((blog) => (
                                        <div
                                            key={blog._id}
                                            className="flex items-center justify-between p-4 bg-gray-900/30 backdrop-blur-xl border border-[#79e708]/20 rounded-xl cursor-pointer hover:bg-gray-900/50 transition-all relative"
                                            onClick={() => navigate(`/blogs/${blog._id}`)}
                                        >
                                            <div className="flex items-center gap-4">
                                                {blog.coverImage && (
                                                    <img
                                                        src={blog.coverImage}
                                                        alt={blog.title}
                                                        className="w-20 h-20 object-cover rounded-lg border border-[#79e708]/20"
                                                    />
                                                )}
                                                <div className="text-left">
                                                    <h3 className="text-white font-semibold">{blog.title}</h3>
                                                    <p className="text-gray-400 text-sm">
                                                        {truncate(blog.shortDesc || blog.content, 80)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                        {blog.authorImage ? (
                                                            <img
                                                                src={blog.authorImage}
                                                                alt={blog.authorName || "Author"}
                                                                className="w-5 h-5 rounded-full object-cover border border-[#79e708]/30"
                                                            />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[10px]">
                                                                {blog.authorName?.[0] || "A"}
                                                            </div>
                                                        )}
                                                        <span>{blog.authorName || "Unknown"}</span>
                                                        <span>• {formatDate(blog.date)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Admin Icons */}
                                            {user?.accountRole === "admin" && (
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <Edit
                                                        className="w-5 h-5 text-[#79e708] cursor-pointer hover:text-[#5bb406]"
                                                        onClick={() => navigate(`/blogs/editor/${blog._id}`)}
                                                    />
                                                    <Trash2
                                                        className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-400"
                                                        onClick={() => handleDelete(blog._id)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Floating Add Blog Button (Visible only for Admin) */}
                {user?.accountRole === "admin" && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 bg-[#79e708] text-black font-bold rounded-full shadow-lg shadow-[#79e708]/40 hover:bg-[#5bb406] transition-all"
                        onClick={() => navigate("/blogs/editor")}
                    >
                        <Plus className="w-5 h-5" />
                        Add Blog
                    </motion.button>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Blog;
