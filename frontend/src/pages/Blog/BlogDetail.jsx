import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/landing/Navigation";
import Footer from "../../components/landing/Footer";

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
                setBlog(res.data);
            } catch (err) {
                console.error("Failed to fetch blog:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading)
        return <p className="text-white text-center mt-28 text-xl animate-pulse">Loading...</p>;
    if (!blog)
        return <p className="text-white text-center mt-28 text-xl">Blog not found</p>;

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-black pt-24 px-6 lg:px-20 text-white relative">
                {/* Subtle Background Glow */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#79e708]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#79e708]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Blog Header */}
                <div className="max-w-4xl mx-auto text-center lg:text-left">
                    <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
                        {blog.title}
                    </h1>

                    {/* Author Info */}
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                        {blog.authorImage ? (
                            <img
                                src={blog.authorImage}
                                alt={blog.authorName || "Author"}
                                className="w-10 h-10 rounded-full object-cover border border-[#79e708]/30"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-bold">
                                {blog.authorName?.[0] || "A"}
                            </div>
                        )}
                        <div className="text-left">
                            <p className="text-gray-200 font-semibold">{blog.authorName || "Unknown"}</p>
                            <p className="text-gray-400 text-sm">{new Date(blog.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Cover Image */}
                    {blog.coverImage && (
                        <div className="overflow-hidden rounded-3xl border border-[#79e708]/20 mb-12 shadow-lg shadow-[#79e708]/10">
                            <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="w-full h-[450px] lg:h-[500px] object-cover transform transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                    )}
                </div>

                {/* Blog Content */}
                <div className="max-w-3xl mx-auto prose prose-invert prose-headings:text-[#79e708] prose-a:text-[#79e708] hover:prose-a:text-[#5bb406] prose-img:rounded-xl prose-img:border prose-img:border-[#79e708]/20 prose-img:shadow-md mb-10">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogDetail;
