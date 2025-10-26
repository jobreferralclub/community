import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../../components/landing/Navigation";
import Footer from "../../components/landing/Footer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const BlogEditor = () => {
    const { user } = useAuthStore();
    const { id } = useParams(); // blog id from URL (if editing)
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [content, setContent] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [uploading, setUploading] = useState(false);
    const [loadingBlog, setLoadingBlog] = useState(false);

    const fileInputRef = useRef(null);

    const triggerFileInput = () => fileInputRef.current.click();

    // Fetch blog data if editing
    useEffect(() => {
        if (!id) return;
        const fetchBlog = async () => {
            try {
                setLoadingBlog(true);
                const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
                const blog = res.data;
                setTitle(blog.title);
                setCoverImage(blog.coverImage || "");
                setContent(blog.content);
                setShortDesc(blog.shortDesc || "");
            } catch (err) {
                console.error("Failed to fetch blog:", err);
                alert("Failed to load blog for editing");
            } finally {
                setLoadingBlog(false);
            }
        };
        fetchBlog();
    }, [id]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const res = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setCoverImage(res.data.imageUrl);
        } catch (err) {
            console.error("Image upload failed:", err);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            alert("Title and content are required!");
            return;
        }

        if (!user) {
            alert("You must be logged in to publish a blog");
            return;
        }

        try {
            if (id) {
                // Update existing blog
                await axios.put(`http://localhost:5000/api/blogs/${id}`, {
                    title,
                    coverImage,
                    shortDesc,
                    content,
                    authorName: user.name,
                    authorImage: user.avatar,
                });
                alert("Blog updated successfully!");
            } else {
                // Create new blog
                await axios.post("http://localhost:5000/api/blogs", {
                    title,
                    coverImage,
                    shortDesc,
                    content,
                    authorName: user.name,
                    authorImage: user.avatar,
                    date: new Date(),
                });
                alert("Blog created successfully!");
            }

            navigate("/blogs"); // go back to blog list
        } catch (err) {
            console.error("Blog submission failed:", err);
            alert("Failed to submit blog");
        }
    };

    if (loadingBlog) return <p className="text-white text-center mt-28">Loading blog...</p>;

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-black relative pt-20 pb-12 px-6">
                <div className="relative z-10 flex gap-6 max-w-7xl mx-auto">
                    <div className="w-2/5 flex flex-col gap-6 bg-black/40 backdrop-blur-xl rounded-xl p-6">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Blog Title"
                            className="w-full px-4 py-3 bg-black/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#79e708] placeholder-gray-500 border border-[#79e708]"
                        />

                        {/* Image Upload */}
                        <div>
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="px-4 py-2 bg-[#79e708] text-black font-semibold rounded-lg hover:bg-[#5bb406] transition-all"
                            >
                                {uploading ? "Uploading..." : "Select Image"}
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            {coverImage && (
                                <img
                                    src={coverImage}
                                    alt="Cover Preview"
                                    className="mt-3 w-full aspect-[16/9] object-cover border border-[#79e708]"
                                />
                            )}
                        </div>

                        {/* Short Description */}
                        <div className="relative">
                            <textarea
                                value={shortDesc}
                                onChange={(e) => setShortDesc(e.target.value)}
                                rows={4}
                                placeholder="Short Description..."
                                className="w-full px-4 py-3 bg-black/60 text-white rounded-s rounded-e focus:outline-none focus:ring-2 focus:ring-[#79e708] placeholder-gray-500 border border-[#79e708] focus:border-[#79e708]"
                            />
                            <div className="absolute bottom-2 right-3 text-sm font-medium">
                                <span className={`${shortDesc.length > 100 ? "text-red-500" : "text-green-400"}`}>
                                    {shortDesc.length}/100
                                </span>
                            </div>
                        </div>

                        {/* Publish Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            className="mt-auto px-5 py-3 bg-[#79e708] text-black font-bold rounded-lg shadow-md hover:bg-[#5bb406] transition-all"
                        >
                            {id ? "Update Blog" : "Publish Blog"}
                        </motion.button>
                    </div>

                    {/* Editor */}
                    <div className="w-3/5 bg-black/40 backdrop-blur-xl rounded-xl p-4">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            placeholder="Write your blog content here..."
                            modules={{
                                toolbar: [
                                    [{ header: [1, 2, 3, false] }],
                                    ["bold", "italic", "underline", "strike"],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    ["blockquote", "code-block"],
                                    ["link", "image"],
                                    ["clean"],
                                ],
                            }}
                            className="h-[80vh] [&_.ql-editor]:text-white [&_.ql-editor]:text-lg"
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogEditor;
