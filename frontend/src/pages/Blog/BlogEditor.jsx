import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../../components/landing/Navigation";
import Footer from "../../components/landing/Footer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

// Neon green for consistency
const accentColor = "#79e708";

const smallButtonStyles = `
  px-4 py-1 rounded-lg font-semibold text-sm bg-[#79e708] text-black shadow
  transition-all hover:bg-[#b7ff46] focus:ring-2 focus:ring-[#79e708] mr-2
`;

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
  const [banner, setBanner] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

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
      } catch {
        setBanner({ type: "error", message: "Failed to load blog for editing" });
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
      setBanner({ type: "success", message: "Image uploaded!" });
    } catch {
      setBanner({ type: "error", message: "Image upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = () => {
    setCoverImage("");
    setBanner({ type: "success", message: "Image removed" });
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      setBanner({ type: "error", message: "Title and content are required!" });
      return;
    }
    if (!user) {
      setBanner({ type: "error", message: "You must be logged in to publish a blog" });
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
        setBanner({ type: "success", message: "Blog updated successfully!" });
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
        setBanner({ type: "success", message: "Blog created successfully!" });
      }
      setTimeout(() => navigate("/blogs"), 1200);
    } catch {
      setBanner({ type: "error", message: "Failed to submit blog" });
    }
  };

  const cardStyles =
    "w-full bg-[#161819] rounded-2xl shadow-lg p-6 flex flex-col gap-3 mb-6 transition-all duration-300";
  const labelStyles = "mb-1 text-gray-300 font-semibold text-sm";
  const inputStyles =
    "px-4 py-3 bg-[#191c1f] text-white rounded-lg border border-[#233312] focus:outline-none focus:ring-2 focus:ring-[#79e708] text-base transition-all duration-200";

  return (
    <>
      <Navigation />
      {banner && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          className={`fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full z-50 ${
            banner.type === "error" ? "bg-red-600 text-white" : "bg-[#79e708] text-black"
          } shadow-lg font-semibold`}
        >
          {banner.message}
        </motion.div>
      )}
      <div className="min-h-screen bg-[#131516] flex items-center justify-center py-8 px-2 transition-all">
        <motion.div
          className="w-full max-w-[900px] mx-auto rounded-3xl bg-[#17181a]/80 px-2 sm:px-6 py-8 flex flex-col gap-7 shadow-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-xl text-[#79e708] tracking-wide pl-1">
              {id ? "Edit Blog" : "New Blog"}
            </div>
            <div className="flex gap-3 items-center">
              <button
                className={`rounded-full px-4 py-1.5 font-medium border border-[#79e708] text-sm text-[#79e708] bg-transparent transition-all
                ${!isPreview ? "bg-[#232e16]/80 text-white" : ""}`}
                onClick={() => setIsPreview(false)}
              >
                Edit
              </button>
              <button
                className={`rounded-full px-4 py-1.5 font-medium border border-[#79e708] text-sm text-[#232e16] transition-all
                ${isPreview ? "bg-[#79e708] text-black" : ""}`}
                onClick={() => setIsPreview(true)}
              >
                Preview
              </button>
            </div>
          </div>
          {/* Editor/Preview Mode */}
          <AnimatePresence mode="wait">
            {!isPreview ? (
              <motion.form
                key="edit-mode"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="flex flex-col gap-5"
                onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
              >
                {/* Title */}
                <div className={cardStyles}>
                  <label className={labelStyles} htmlFor="blog-title">Blog Title</label>
                  <input
                    id="blog-title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter blog title"
                    className={inputStyles}
                  />
                </div>
                {/* Featured Image */}
                <div className={cardStyles}>
                  <label className={labelStyles}>Featured Image</label>
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className={smallButtonStyles}
                      disabled={uploading}
                      style={{ minWidth: "120px", marginRight: "8px" }}
                    >
                      {uploading ? "Uploading..." : coverImage ? "Change Image" : "Select Image"}
                    </button>
                    {coverImage && (
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className={`${smallButtonStyles} bg-red-600 text-white hover:bg-red-700`}
                        style={{ minWidth: "80px", marginRight: 0 }}
                      >
                        Remove
                      </button>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="mt-3 w-full md:w-2/3 aspect-[16/9] object-cover rounded-xl border border-[#232e16] shadow-md"
                    />
                  )}
                </div>
                {/* Short Description */}
                <div className={cardStyles}>
                  <label className={labelStyles} htmlFor="blog-shortdesc">Short Description</label>
                  <textarea
                    id="blog-shortdesc"
                    value={shortDesc}
                    onChange={e => setShortDesc(e.target.value)}
                    rows={3}
                    maxLength={100}
                    placeholder="Short description (max 100 chars)"
                    className={inputStyles}
                  />
                  <div className={`mt-1 text-right text-xs ${shortDesc.length > 100 ? "text-red-500" : "text-green-400"}`}>
                    {shortDesc.length}/100
                  </div>
                </div>
                {/* Content Editor */}
                <div className={cardStyles + " pb-1"}>
                  <label className={labelStyles}>Content</label>
                  <div>
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
                      className="rounded-2xl border border-[#233312] shadow-md bg-[#191c1f] px-1 [&_.ql-editor]:text-white [&_.ql-editor]:p-4"
                      style={{
                        minHeight: "250px",
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>
                {/* Submit Button */}
                <div className="flex gap-2 justify-end">
                  <motion.button
                    type="submit"
                    className={smallButtonStyles + " w-auto mt-2"}
                    style={{ minWidth: "140px" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {id ? "Update Blog" : "Publish Blog"}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="preview-mode"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="flex flex-col gap-6"
              >
                {/* Preview Info */}
                <div className={cardStyles}>
                  <div className="text-base text-gray-400 mb-1">Blog Title</div>
                  <div className="text-xl font-bold text-white">{title || <span className="italic text-gray-600">No Title</span>}</div>
                </div>
                <div className={cardStyles}>
                  <div className="text-base text-gray-400 mb-1">Featured Image</div>
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full max-h-56 object-cover rounded-xl border border-[#233312] shadow" />
                  ) : (
                    <div className="italic text-gray-600">No image selected</div>
                  )}
                </div>
                <div className={cardStyles}>
                  <div className="text-base text-gray-400 mb-1">Short Description</div>
                  <div className="text-white">{shortDesc || <span className="italic text-gray-600">No description</span>}</div>
                </div>
                <div className={cardStyles}>
                  <div className="text-base text-gray-400 mb-1">Content</div>
                  <div
                    className="prose prose-invert max-w-full"
                    dangerouslySetInnerHTML={{ __html: content || "<p class='italic text-gray-600'>No content.</p>" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
      <style>
        {`
          body { background: #131516; }
          @media (max-width: 640px) {
            .max-w-[900px] { max-width: 97vw !important; }
            .rounded-3xl, .rounded-2xl, .rounded-xl { border-radius: 18px !important; }
            form > div, .flex-col > div { margin-bottom: 1rem !important; }
            .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
            .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
          }
        `}
      </style>
    </>
  );
};

export default BlogEditor;
