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
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);

  const fileInputRef = useRef(null);

  const triggerFileInput = () => fileInputRef.current.click();

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        setLoadingBlog(true);
        const res = await axios.get(`${import.meta.env.VITE_API_PORT}/api/blogs/${id}`);
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
      const res = await axios.post(`${import.meta.env.VITE_API_PORT}/api/upload`, formData, {
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
        await axios.put(`${import.meta.env.VITE_API_PORT}/api/blogs/${id}`, {
          title,
          coverImage,
          shortDesc,
          content,
          authorName: user.name,
          authorImage: user.avatar,
        });
        alert("Blog updated successfully!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_PORT}/api/blogs`, {
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

      navigate("/blogs");
    } catch (err) {
      console.error("Blog submission failed:", err);
      alert("Failed to submit blog");
    }
  };

  if (loadingBlog)
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <p className="text-white text-xl">Loading blog...</p>
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
          <div className="mb-12 text-center">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-[#79e708] to-white bg-clip-text text-transparent">
              {id ? "Edit Blog" : "Create New Blog"}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Share your insights and expertise with the community
            </p>
          </div>

          <div className="flex gap-8 max-w-7xl mx-auto">
            {/* Controls Card */}
            <div className="w-2/5 flex flex-col gap-6 bg-zinc-900/60 backdrop-blur-xl border border-[#79e708]/20 rounded-3xl p-8 shadow-lg">
              {/* Title Input */}
              <div>
                <label
                  className="block text-white font-semibold text-lg mb-3"
                  htmlFor="blog-title"
                >
                  Title
                </label>
                <input
                  id="blog-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your blog title..."
                  className="w-full px-4 py-3 bg-black/60 text-white rounded-xl font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#79e708] transition-all text-base border border-[#79e708]/10 focus:border-[#79e708]/50"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label
                  className="block text-white font-semibold text-lg mb-3"
                  htmlFor="cover-image-input"
                >
                  Cover Image
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={triggerFileInput}
                  className="w-full px-5 py-3 bg-[#79e708] text-black font-bold rounded-xl shadow-lg shadow-[#79e708]/30 hover:bg-[#5bb406] transition-all"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Select Image"}
                </motion.button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  id="cover-image-input"
                  className="hidden"
                />
                {coverImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4"
                  >
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full aspect-video object-cover border-2 border-[#79e708]/50 rounded-xl shadow-lg"
                    />
                  </motion.div>
                )}
              </div>

              {/* Short Description */}
              <div className="relative">
                <label
                  htmlFor="short-desc"
                  className="block text-white text-lg font-semibold mb-3"
                >
                  Short Description
                </label>
                <textarea
                  id="short-desc"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  rows={4}
                  placeholder="Brief description for preview cards..."
                  className="w-full px-4 py-3 bg-black/60 text-white rounded-xl font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#79e708] border border-[#79e708]/10 focus:border-[#79e708]/50 transition-all resize-none"
                  maxLength={150}
                />
                <div className="absolute bottom-3 right-4 text-sm font-medium">
                  <span
                    className={`${
                      shortDesc.length > 150 ? "text-red-400" : "text-gray-500"
                    }`}
                  >
                    {shortDesc.length}/150
                  </span>
                </div>
              </div>

              {/* Publish Button */}
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 8px 30px #79e70844" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="mt-auto px-6 py-4 bg-[#79e708] text-black font-bold text-lg rounded-xl shadow-lg shadow-[#79e708]/40 hover:bg-[#5bb406] transition-all"
              >
                {id ? "Update Blog" : "Publish Blog"}
              </motion.button>
            </div>

            {/* Editor Card */}
            <div className="w-3/5 bg-zinc-900/60 backdrop-blur-xl border border-[#79e708]/20 rounded-3xl p-8 shadow-lg flex flex-col">
              <label className="block text-white font-semibold text-lg mb-4">
                Content
              </label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder="Start writing your amazing content..."
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
                className="flex-1 rounded-xl [&_.ql-container]:border-[#79e708]/10 [&_.ql-editor]:text-white [&_.ql-editor]:text-base [&_.ql-editor]:leading-relaxed [&_.ql-toolbar]:bg-black/50 [&_.ql-toolbar]:border-[#79e708]/10 [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl [&_.ql-toolbar_button]:text-gray-400 [&_.ql-toolbar_button:hover]:text-[#79e708] [&_.ql-stroke]:stroke-gray-400 [&_.ql-fill]:fill-gray-400 [&_.ql-picker-label]:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogEditor;