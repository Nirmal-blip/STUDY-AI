import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import SummaryModal from "./SummaryModal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaSearch,
  FaVideo,
  FaClock,
  FaBrain,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

interface Video {
  _id: string;
  title: string;
  status: "idle" | "processing" | "ready" | "failed";
  summary?: string;
  keyPoints?: string[];
  duration?: number;
}

const VideoSummaries: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 🔥 NEW: global loading
  const [isLoading, setIsLoading] = useState(true);

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const fetchedRef = useRef(false);

  /* ===================== FETCH VIDEOS ===================== */
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const controller = new AbortController();

    const fetchVideos = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/video`,
          { credentials: "include", signal: controller.signal }
        );

        if (!res.ok) throw new Error("Failed to fetch videos");

        const data = await res.json();

        const formatted = (data.videos || []).map((v: any) => ({
          _id: v._id,
          title: v.title,
          duration: v.duration,
          summary: v.summary,
          keyPoints: v.keyPoints,
          status: v.summary ? "ready" : "idle",
        }));

        setVideos(formatted);
      } catch (err) {
        if (err instanceof DOMException) return;
        console.error("Failed to fetch videos:", err);
      } finally {
        setIsLoading(false); // 🔥 stop loader
      }
    };

    fetchVideos();
    return () => controller.abort();
  }, []);

  /* ===================== GENERATE SUMMARY ===================== */
  const generateSummary = async (videoId: string) => {
    try {
      setLoadingId(videoId);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/video/${videoId}/summary`,
        { method: "POST", credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to start summary");

      setVideos(prev =>
        prev.map(v =>
          v._id === videoId ? { ...v, status: "processing" } : v
        )
      );
    } catch {
      alert("❌ Failed to start summary generation");
    } finally {
      setLoadingId(null);
    }
  };

  /* ===================== POLLING ===================== */
  useEffect(() => {
    const processing = videos.filter(v => v.status === "processing");
    if (processing.length === 0) return;

    const interval = setInterval(async () => {
      for (const video of processing) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/video/${video._id}/status`,
            { credentials: "include" }
          );
          const data = await res.json();

          if (data.status === "ready" || data.status === "failed") {
            setVideos(prev =>
              prev.map(v =>
                v._id === video._id
                  ? {
                      ...v,
                      status: data.status,
                      summary: data.summary,
                      keyPoints: data.keyPoints,
                    }
                  : v
              )
            );
          }
        } catch {
          console.error("Polling failed for", video._id);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [videos]);

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  const primaryGradient = "bg-gradient-to-r from-indigo-600 to-purple-600";

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Sidebar />

      <main className="lg:ml-80 p-6 lg:p-10">
        {/* HEADER */}
        <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 shadow-lg text-white">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/20 rounded-2xl">
              <FaVideo className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Video Summaries</h1>
              <p className="text-white/90 mt-1">
                AI-generated summaries from video transcripts
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 GLOBAL LOADER */}
        {isLoading && (
          <div className="flex justify-center items-center py-40">
            <div className="text-center">
              <FaSpinner className="mx-auto text-5xl animate-spin text-indigo-600 mb-4" />
              <p className="text-lg font-semibold text-gray-700">
                Loading your videos...
              </p>
            </div>
          </div>
        )}

        {/* CONTENT */}
        {!isLoading && (
          <>
            {/* SEARCH */}
            <div className="mb-6 max-w-2xl mx-auto">
              <div className="relative">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search your videos..."
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border shadow-lg text-lg"
                />
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredVideos.map(video => (
                <div
                  key={video._id}
                  className="bg-white rounded-3xl shadow-xl border overflow-hidden hover:shadow-2xl transition"
                >
                  <div className="p-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-semibold mb-6">
                      <FaVideo />
                      YOUTUBE
                    </div>

                    <h3 className="text-2xl font-bold mb-5">{video.title}</h3>

                    <div className="flex items-center gap-6 text-gray-600 mb-4">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <FaClock className="text-indigo-500" />
                        {video.duration
                          ? `${Math.round(video.duration / 60)} min`
                          : "-"}
                      </span>
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <FaBrain className="text-purple-500" />
                        AI Summary
                      </span>
                    </div>

                    {video.status === "idle" && (
                      <button
                        onClick={() => generateSummary(video._id)}
                        disabled={loadingId === video._id}
                        className={`w-full ${primaryGradient} text-white py-4 rounded-2xl font-semibold text-lg`}
                      >
                        {loadingId === video._id ? (
                          <>
                            <FaSpinner className="inline mr-2 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          "Generate Summary"
                        )}
                      </button>
                    )}

                    {video.status === "processing" && (
                      <div className="text-center py-10">
                        <FaSpinner className="mx-auto text-4xl animate-spin text-indigo-600 mb-4" />
                        <p className="font-semibold text-lg">
                          Generating Summary
                        </p>
                        <p className="text-gray-500">
                          This may take a minute
                        </p>
                      </div>
                    )}

                    {video.status === "ready" && (
                      <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-2xl border">
                          <div className="flex items-center gap-2 text-green-700 mb-3">
                            <FaCheckCircle />
                            <span className="font-semibold">
                              Summary Ready
                            </span>
                          </div>
                          <div className="prose prose-sm line-clamp-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {video.summary || ""}
                            </ReactMarkdown>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveVideo(video);
                            setSummaryOpen(true);
                          }}
                          className={`w-full ${primaryGradient} text-white py-4 rounded-2xl font-semibold`}
                        >
                          View Full Summary
                        </button>
                      </div>
                    )}

                    {video.status === "failed" && (
                      <div className="space-y-6">
                        <div className="p-6 bg-red-50 rounded-2xl text-center">
                          <FaExclamationTriangle className="mx-auto text-4xl text-red-600 mb-3" />
                          <p className="font-semibold text-red-700">
                            Generation Failed
                          </p>
                        </div>
                        <button
                          onClick={() => generateSummary(video._id)}
                          className={`w-full ${primaryGradient} text-white py-4 rounded-2xl font-semibold`}
                        >
                          Retry Summary
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {activeVideo && (
        <SummaryModal
          open={summaryOpen}
          onClose={() => setSummaryOpen(false)}
          title={activeVideo.title}
          summary={activeVideo.summary || ""}
          keyPoints={activeVideo.keyPoints || []}
        />
      )}
    </div>
  );
};

export default VideoSummaries;
