import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import SummaryModal from "./SummaryModal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaSearch,
  FaFilePdf,
  FaClock,
  FaEye,
  FaBrain,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

interface Note {
  _id: string;
  title: string;
  type: "pdf" | "note";
  status: "idle" | "processing" | "ready" | "failed";
  summary?: string;
  keyPoints?: string[];
  metadata?: {
    pageCount?: number;
  };
  filePath?: string;
}

const NotesSummaryHistory: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const controller = new AbortController();

    const fetchNotes = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload/documents`,
          { credentials: "include", signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setNotes(data.documents || []);
      } catch (err) {
        if (err instanceof DOMException) return;
        console.error("Failed to fetch documents:", err);
      }
    };

    fetchNotes();
    return () => controller.abort();
  }, []);

  const generateSummary = async (docId: string) => {
    try {
      setLoadingId(docId);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload/documents/${docId}/summary`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to start summary");
      
      setNotes(prev =>
        prev.map(n => (n._id === docId ? { ...n, status: "processing" } : n))
      );
    } catch {
      alert("❌ Failed to start summary generation");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    const processing = notes.filter(n => n.status === "processing");
    if (processing.length === 0) return;

    const interval = setInterval(async () => {
      for (const note of processing) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/upload/documents/${note._id}/status`,
            { credentials: "include" }
          );
          const data = await res.json();

          if (data.status === "ready" || data.status === "failed") {
            setNotes(prev =>
              prev.map(n =>
                n._id === note._id
                  ? {
                      ...n,
                      status: data.status,
                      summary: data.summary,
                      keyPoints: data.keyPoints,
                    }
                  : n
              )
            );
          }
        } catch {
          console.error("Polling failed for", note._id);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [notes]);

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const pdfUrl = (note: Note) =>
    note.filePath ? `${import.meta.env.VITE_BACKEND_URL}${note.filePath}` : null;

  const primaryGradient = "bg-gradient-to-r from-indigo-600 to-purple-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 20, 50 50 T 100 50 Q 75 80, 50 50 T 0 50' fill='none' stroke='%236366f1' stroke-width='2' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "350px 350px",
        }}
      />

      <Sidebar />

      <main className="lg:ml-80 p-6 lg:p-10 relative z-10">
        
         {/* HEADER */}
         <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 shadow-lg text-white">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/20 rounded-2xl">
              <FaFilePdf className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Document Summaries</h1>
              <p className="text-white/90 mt-1">AI-powered insights from your uploaded PDFs</p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your documents..."
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg"
            />
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredNotes.map(note => (
            <div
              key={note._id}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]"
            >
              <div className="p-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-6">
                  <FaFilePdf className="text-indigo-600" />
                  {note.type.toUpperCase()}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-5 line-clamp-1 leading-tight">
                  {note.title}
                </h3>

                {/* Metadata */}
                <div className="flex items-center gap-6 text-gray-600 mb-4">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <FaClock className="text-indigo-500" />
                    {note.metadata?.pageCount ?? "-"} pages
                  </span>
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <FaBrain className="text-purple-500" />
                    AI Summary
                  </span>
                </div>

                {/* Status Content */}
                {note.status === "idle" && (
                  <button
                    onClick={() => generateSummary(note._id)}
                    disabled={loadingId === note._id}
                    className={`w-full ${primaryGradient} text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg`}
                  >
                    {loadingId === note._id ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Starting...
                      </>
                    ) : (
                      "Generate Summary"
                    )}
                  </button>
                )}

                {note.status === "processing" && (
                  <div className="text-center py-10 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200">
                    <FaSpinner className="mx-auto text-4xl text-indigo-600 animate-spin mb-4" />
                    <p className="font-semibold text-gray-800 text-lg">Generating Summary</p>
                    <p className="text-gray-500 mt-2">This usually takes 1–3 minutes</p>
                  </div>
                )}

                {note.status === "ready" && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-inner">
                      <div className="flex items-center gap-2 text-green-700 mb-4">
                        <FaCheckCircle className="text-xl" />
                        <span className="font-semibold text-lg">Summary Ready</span>
                      </div>
                      <div className="text-gray-700 text-base line-clamp-4 leading-relaxed prose prose-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {note.summary || ""}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveNote(note);
                        setSummaryOpen(true);
                      }}
                      className={`w-full ${primaryGradient} text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg`}
                    >
                      View Full Summary
                    </button>
                  </div>
                )}

                {note.status === "failed" && (
                  <div className="space-y-6">
                    <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-center shadow-inner">
                      <FaExclamationTriangle className="mx-auto text-4xl text-red-600 mb-4" />
                      <p className="font-semibold text-red-700 text-lg">Generation Failed</p>
                    </div>
                    <button
                      onClick={() => generateSummary(note._id)}
                      className={`w-full ${primaryGradient} text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg`}
                    >
                      Retry Summary
                    </button>
                  </div>
                )}

                {/* View PDF Link */}
                {pdfUrl(note) && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <a
                      href={pdfUrl(note)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-3 text-indigo-600 hover:text-indigo-800 font-semibold py-3 transition-colors duration-200 text-lg"
                    >
                      <FaEye className="text-xl" />
                      Open Original PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {activeNote && (
        <SummaryModal
          open={summaryOpen}
          onClose={() => setSummaryOpen(false)}
          title={activeNote.title}
          summary={activeNote.summary || ""}
          keyPoints={activeNote.keyPoints || []}
        />
      )}
    </div>
  );
};

export default NotesSummaryHistory;