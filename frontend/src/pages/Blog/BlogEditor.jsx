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

      navigate("/blogs");
    } catch (err) {
      console.error("Blog submission failed:", err);
      alert("Failed to submit blog");
    }
  };

  if (loadingBlog)
    return (
      <p className="text-white text-center mt-28">Loading blog...</p>
    );

  return (
    <>
      <Navigation />
      <div
        className="min-h-screen bg-black relative pt-20 pb-14 px-6"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="relative z-10 flex gap-8 max-w-7xl mx-auto">
          {/* Controls Card */}
          <div className="w-2/5 flex flex-col gap-7 bg-black/70 backdrop-blur-xl rounded-xl p-7 shadow-lg shadow-black/60">
            {/* Title Input */}
            <div>
              <label
                className="block text-gray-100 font-semibold text-lg mb-2 tracking-wide"
                htmlFor="blog-title"
              >
                Title
              </label>
              <input
                id="blog-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog Title"
                className="w-full px-4 py-3 bg-black/60 text-white rounded-xl font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#79e708] shadow-sm transition-all text-lg border border-transparent focus:border-lime-500"
              />
            </div>
            {/* Image Upload */}
            <div>
              <label
                className="block text-gray-100 font-semibold text-lg mb-2 tracking-wide"
                htmlFor="cover-image-input"
              >
                Cover Image
              </label>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.07, boxShadow: "0 2px 18px #8fee69cc" }}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={triggerFileInput}
                  className="px-4 py-[10px] bg-[#79e708] text-black font-semibold rounded-lg shadow focus:outline-none transition-all duration-200 hover:bg-[#5bb406] focus:ring-2 focus:ring-lime-400"
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
              </div>
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="mt-4 w-full aspect-[16/9] object-cover border-2 border-[#79e708] rounded-lg transition-all duration-200 shadow-lg"
                />
              )}
            </div>
            {/* Short Description */}
            <div className="relative">
              <label
                htmlFor="short-desc"
                className="block text-gray-100 text-lg font-semibold mb-2"
              >
                Short Description
              </label>
              <textarea
                id="short-desc"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                rows={4}
                placeholder="Short Description..."
                className="w-full px-4 py-3 bg-black/60 text-white rounded-xl font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#79e708] border border-transparent focus:border-lime-500 shadow-sm transition-all"
                maxLength={100}
              />
              <div className="absolute bottom-2 right-4 text-sm font-medium">
                <span
                  className={`${
                    shortDesc.length > 100
                      ? "text-red-500"
                      : "text-lime-400"
                  }`}
                >
                  {shortDesc.length}/100
                </span>
              </div>
            </div>
            {/* Publish Button */}
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: "0 2px 18px #a2ff68aa",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="mt-auto px-5 py-3 bg-[#79e708] text-black font-bold rounded-xl shadow-lg focus:ring-2 focus:ring-lime-400 transition-all duration-200 hover:bg-[#5bb406]"
            >
              {id ? "Update Blog" : "Publish Blog"}
            </motion.button>
          </div>
          {/* Editor Card */}
          <div className="w-3/5 bg-black/70 backdrop-blur-xl rounded-xl p-7 shadow-lg shadow-black/60 flex flex-col">
            <label className="block text-gray-100 font-semibold text-lg mb-4 tracking-wide">
              Content
            </label>
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
              className="h-[80vh] rounded-xl font-medium [&_.ql-editor]:text-white [&_.ql-editor]:text-lg [&_.ql-editor]:leading-relaxed [&_.ql-toolbar]:bg-black/50 [&_.ql-toolbar]:text-gray-400"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogEditor;
