import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/landing/Navigation";
import Footer from "../../components/landing/Footer";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_PORT}/api/blogs/${id}`);
                setBlog(res.data);
            } catch (err) {
                console.error("Failed to fetch blog:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    const formatDate = (dateStr) => {
        const options = { day: "numeric", month: "long", year: "numeric" };
        return new Date(dateStr).toLocaleDateString("en-GB", options);
    };

    if (loading)
        return (
            <>
                <Navigation />
                <div className="min-h-screen bg-black flex items-center justify-center">
                    <p className="text-white text-xl animate-pulse">Loading blog...</p>
                </div>
            </>
        );

    if (!blog)
        return (
            <>
                <Navigation />
                <div className="min-h-screen bg-black flex items-center justify-center">
                    <p className="text-white text-xl">Blog not found</p>
                </div>
            </>
        );

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-black relative overflow-hidden pt-20">
                {/* Background Effects - Same as Blog page */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(121,231,8,0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(121,231,8,0.03) 1px, transparent 1px)
                            `,
                            backgroundSize: "60px 60px",
                        }}
                    />
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#79e708]/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#79e708]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-6 py-12">
                    {/* Back Button */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <motion.button
                            whileHover={{ scale: 1.05, x: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/blogs")}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#79e708] transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:text-[#79e708]" />
                            <span className="font-medium">Back to Blogs</span>
                        </motion.button>
                    </div>

                    {/* Blog Header */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent leading-tight"
                        >
                            {blog.title}
                        </motion.h1>

                        {/* Author & Date Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap items-center gap-6 mb-8"
                        >
                            {/* Author */}
                            <div className="flex items-center gap-3">
                                {blog.authorImage ? (
                                    <img
                                        src={blog.authorImage}
                                        alt={blog.authorName || "Author"}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-[#79e708]/30 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white text-lg font-bold border-2 border-[#79e708]/30">
                                        {blog.authorName?.[0] || "A"}
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-[#79e708]" />
                                        <p className="text-white font-semibold text-lg">
                                            {blog.authorName || "Unknown"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4 text-[#79e708]" />
                                <span className="text-sm font-medium">
                                    {formatDate(blog.date)}
                                </span>
                            </div>
                        </motion.div>

                        {/* Short Description */}
                        {blog.shortDesc && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="text-xl text-gray-300 leading-relaxed mb-10 italic border-l-4 border-[#79e708]/50 pl-6 py-2"
                            >
                                {blog.shortDesc}
                            </motion.p>
                        )}

                        {/* Cover Image */}
                        {blog.coverImage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="overflow-hidden rounded-3xl border-2 border-[#79e708]/20 mb-12 shadow-2xl shadow-[#79e708]/10 group"
                            >
                                <img
                                    src={blog.coverImage}
                                    alt={blog.title}
                                    className="w-full h-[400px] lg:h-[500px] object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Blog Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="bg-zinc-900/40 backdrop-blur-sm border border-[#79e708]/10 rounded-3xl p-8 lg:p-12 shadow-xl">
                            <div
                                className="prose prose-invert prose-lg max-w-none
                                    prose-headings:text-white prose-headings:font-bold
                                    prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:text-[#79e708]
                                    prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:text-[#79e708]
                                    prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5 prose-h3:text-[#79e708]/90
                                    prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4
                                    prose-h5:text-lg prose-h5:mb-2 prose-h5:mt-3
                                    prose-h6:text-base prose-h6:mb-1 prose-h6:mt-2 prose-h6:uppercase prose-h6:tracking-wide
                                    prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                                    prose-a:text-[#79e708] prose-a:no-underline prose-a:font-semibold hover:prose-a:text-[#5bb406] hover:prose-a:underline
                                    prose-strong:text-white prose-strong:font-bold
                                    prose-em:text-gray-200
                                    prose-code:text-[#79e708] prose-code:bg-black/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono
                                    prose-pre:bg-black/70 prose-pre:border prose-pre:border-[#79e708]/20 prose-pre:rounded-xl prose-pre:shadow-lg
                                    prose-blockquote:border-l-4 prose-blockquote:border-[#79e708] prose-blockquote:bg-black/30 prose-blockquote:pl-6 prose-blockquote:py-3 prose-blockquote:italic prose-blockquote:text-gray-300
                                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                                    prose-li:text-gray-300 prose-li:mb-2 prose-li:leading-relaxed
                                    prose-li::marker:text-[#79e708]
                                    prose-img:rounded-2xl prose-img:border-2 prose-img:border-[#79e708]/30 prose-img:shadow-xl prose-img:my-6
                                    prose-hr:border-[#79e708]/20 prose-hr:my-8
                                    prose-table:border prose-table:border-[#79e708]/20 prose-table:rounded-lg
                                    prose-th:bg-[#79e708]/10 prose-th:text-[#79e708] prose-th:font-bold prose-th:p-3
                                    prose-td:p-3 prose-td:border prose-td:border-[#79e708]/10"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </div>
                    </motion.div>

                    {/* Back to Blogs CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="max-w-3xl mx-auto mt-12 text-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 8px 30px #79e70844" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/blogs")}
                            className="px-8 py-4 bg-[#79e708] text-black font-bold text-lg rounded-xl shadow-lg shadow-[#79e708]/40 hover:bg-[#5bb406] transition-all inline-flex items-center gap-3"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Explore More Blogs
                        </motion.button>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogDetail;