import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaFilePdf,
  FaYoutube,
  FaTrash,
  FaSpinner,
  FaUpload,
  FaFileAlt,
  FaTimes,
} from "react-icons/fa";

interface StudySource {
  _id: string;
  type: "pdf" | "note" | "youtube";
  title: string;
  description?: string;
  uploadedAt: string;
  status: "active" | "inactive" | "processing";
  summary?: string;
  metadata?: any;
}

const UploadedFilesPage: React.FC = () => {
  const [pdfsAndNotes, setPdfsAndNotes] = useState<StudySource[]>([]);
  const [videos, setVideos] = useState<StudySource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      setIsLoading(true);
      const [docsRes, videosRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/upload/documents`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/video`, { withCredentials: true }),
      ]);

      const docs: StudySource[] = docsRes.data.documents.map((doc: any) => ({
        _id: doc._id,
        type: doc.type,
        title: doc.title,
        description:
          doc.summary?.substring(0, 120) + "..." ||
          (doc.type === "pdf" ? `${doc.metadata?.pageCount || 0} pages` : "Text note"),
        uploadedAt: new Date(doc.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: doc.isActive ? "active" : "inactive",
        summary: doc.summary,
        metadata: doc.metadata,
      }));

      const vids: StudySource[] = videosRes.data.videos.map((video: any) => ({
        _id: video._id,
        type: "youtube",
        title: video.title,
        description:
          video.summary?.substring(0, 120) + "..." ||
          (video.status === "processing" ? "Transcribing video..." : "YouTube video"),
        uploadedAt: new Date(video.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: video.status || "active",
        summary: video.summary,
      }));

      setPdfsAndNotes(docs);
      setVideos(vids);
    } catch (error) {
      console.error("Error fetching sources:", error);
      toast.error("Failed to load your sources");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePDFUpload = async () => {
    if (!selectedFile) return toast.error("Please select a PDF file");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (pdfTitle.trim()) formData.append("title", pdfTitle.trim());
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload/pdf`, formData, {
        withCredentials: true,
      });
      toast.success("PDF uploaded successfully!");
      setShowPDFModal(false);
      setSelectedFile(null);
      setPdfTitle("");
      fetchSources();
    } catch {
      toast.error("Failed to upload PDF");
    }
  };

  const handleYouTubeUpload = async () => {
    if (!youtubeUrl.trim()) return toast.error("Enter a valid YouTube URL");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/video/add`,
        { youtubeUrl: youtubeUrl.trim(), title: youtubeTitle.trim() || undefined },
        { withCredentials: true }
      );
      toast.success(response.data.message || "YouTube video added!");
      setShowYouTubeModal(false);
      setYoutubeUrl("");
      setYoutubeTitle("");
      fetchSources();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to add video";
      toast.error(errorMessage);
      console.error("Video upload error:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      const url = type === "youtube" ? `/api/video/${id}` : `/api/upload/documents/${id}`;
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}${url}`, { withCredentials: true });
      toast.success("Deleted successfully!");
      fetchSources();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const renderCard = (src: StudySource) => {
    const isVideo = src.type === "youtube";
    const icon = isVideo ? <FaYoutube /> : src.type === "pdf" ? <FaFilePdf /> : <FaFileAlt />;
    const gradient = isVideo
      ? "from-red-500 to-red-600"
      : src.type === "pdf"
      ? "from-indigo-500 to-purple-600"
      : "from-blue-500 to-indigo-600";

    return (
      <div
        key={src._id}
        className={`group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden hover:shadow-3xl hover:scale-[1.04] hover:-translate-y-1 transition-all duration-400 transform-gpu`}
        style={{
          background: `linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,245,255,0.9))`,
        }}
      >
        {/* Enhanced Thumbnail with Gradient Overlay */}
        <div className="relative h-48 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-white shadow-2xl bg-gradient-to-br ${gradient}`}>
              {icon}
            </div>
          </div>
          {isVideo && (
            <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
              YouTube
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-700 transition-colors">
            {src.title}
          </h3>
          <div className="text-gray-700 text-sm mb-4 line-clamp-3 prose prose-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{src.description}</ReactMarkdown>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-600">{src.uploadedAt}</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                src.status === "active"
                  ? "bg-green-100 text-green-700"
                  : src.status === "processing"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {src.status === "processing" ? "Processing..." : "Active"}
            </span>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => handleDelete(src._id, src.type)}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hover:scale-110"
        >
          <FaTrash size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white relative overflow-hidden">
    

      <Sidebar />

      <main className="lg:ml-80 px-6 py-12 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl">
              <FaUpload className="text-3xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
              Your Study Sources
            </h1>
          </div>
          <p className="text-gray-600 mt-2 text-lg">All your PDFs, notes & videos in one beautiful place</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button
            onClick={() => setShowPDFModal(true)}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <FaFilePdf className="text-xl" />
            Upload PDF
          </button>

          <button
            onClick={() => setShowYouTubeModal(true)}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <FaYoutube className="text-xl" />
            Add YouTube Video
          </button>
        </div>

        {/* PDFs & Notes Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <FaFilePdf className="text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              PDFs & Notes
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <FaSpinner className="animate-spin text-5xl text-indigo-600" />
            </div>
          ) : pdfsAndNotes.length === 0 ? (
            <div className="text-center py-20 bg-white/70 rounded-3xl border border-dashed border-indigo-200 shadow-lg">
              <FaFilePdf className="mx-auto text-7xl text-indigo-400 mb-6 animate-pulse" />
              <p className="text-2xl font-semibold text-gray-700">No PDFs or notes yet</p>
              <p className="text-gray-500 mt-3">Upload your first study material!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pdfsAndNotes.map(renderCard)}
            </div>
          )}
        </section>

        {/* YouTube Videos Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <FaYoutube className="text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
              YouTube Videos
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <FaSpinner className="animate-spin text-5xl text-indigo-600" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20 bg-white/70 rounded-3xl border border-dashed border-red-200 shadow-lg">
              <FaYoutube className="mx-auto text-7xl text-red-400 mb-6 animate-pulse" />
              <p className="text-2xl font-semibold text-gray-700">No videos added yet</p>
              <p className="text-gray-500 mt-3">Add your favorite lectures!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map(renderCard)}
            </div>
          )}
        </section>
      </main>

      {/* PDF MODAL */}
      {showPDFModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-md p-4">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-gray-100/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload PDF</h2>
              <button onClick={() => setShowPDFModal(false)}>
                <FaTimes className="text-2xl text-gray-500 hover:text-gray-800 transition" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-400 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50/30 transition-all duration-300"
              >
                <FaUpload className="mx-auto text-4xl text-indigo-600 mb-3" />
                <p className="text-gray-600">Click or drag & drop your PDF</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                {selectedFile && <p className="mt-3 text-indigo-700 font-medium">{selectedFile.name}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
              <input
                type="text"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                placeholder="Enter a custom title"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-base"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowPDFModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-base"
              >
                Cancel
              </button>
              <button
                onClick={handlePDFUpload}
                disabled={!selectedFile}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 transition text-base"
              >
                Upload PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YOUTUBE MODAL */}
      {showYouTubeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-md p-4">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-gray-100/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add YouTube Video</h2>
              <button onClick={() => setShowYouTubeModal(false)}>
                <FaTimes className="text-2xl text-gray-500 hover:text-gray-800 transition" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-base"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
              <input
                type="text"
                value={youtubeTitle}
                onChange={(e) => setYoutubeTitle(e.target.value)}
                placeholder="Custom title"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-base"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowYouTubeModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleYouTubeUpload}
                disabled={!youtubeUrl.trim()}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 transition text-base"
              >
                Add Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadedFilesPage;