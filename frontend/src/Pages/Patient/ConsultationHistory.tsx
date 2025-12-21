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
        prev.map(n =>
          n._id === docId ? { ...n, status: "processing" } : n
        )
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Sidebar />

      <main className="lg:ml-80 p-6 lg:p-10">
        {/* HEADER */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-lg text-white">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* GIRL GIF + AUDIO (FIXED RESPONSIVE) */}
            <div className="flex flex-col items-center gap-4 scale-90 sm:scale-95 lg:scale-100">
              <img
                src="/girl-ai.gif"
                alt="AI Assistant"
                className="w-40 sm:w-48 lg:w-56"
              />
              <audio controls className="w-56 sm:w-64">
                <source src="/ai-voice.mp3" type="audio/mpeg" />
                Your browser does not support audio.
              </audio>
            </div>

            {/* TEXT */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold">Document Summaries</h1>
              <p className="text-white/90 mt-2">
                AI-powered insights from your uploaded PDFs
              </p>
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
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border shadow-lg focus:ring-2 focus:ring-indigo-500 text-lg"
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredNotes.map(note => (
            <div
              key={note._id}
              className="bg-white rounded-3xl shadow-xl border p-8 hover:shadow-2xl transition"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full mb-4">
                <FaFilePdf /> {note.type.toUpperCase()}
              </div>

              <h3 className="text-2xl font-bold mb-4">{note.title}</h3>

              {note.status === "idle" && (
                <button
                  onClick={() => generateSummary(note._id)}
                  className={`w-full ${primaryGradient} text-white py-4 rounded-xl font-semibold`}
                >
                  Generate Summary
                </button>
              )}

              {note.status === "processing" && (
                <div className="text-center py-6">
                  <FaSpinner className="animate-spin mx-auto text-3xl text-indigo-600" />
                  <p className="mt-2 font-semibold">Processing...</p>
                </div>
              )}

              {note.status === "ready" && (
                <>
                  <div className="prose prose-sm line-clamp-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {note.summary || ""}
                    </ReactMarkdown>
                  </div>
                  <button
                    onClick={() => {
                      setActiveNote(note);
                      setSummaryOpen(true);
                    }}
                    className={`mt-4 w-full ${primaryGradient} text-white py-3 rounded-xl`}
                  >
                    View Full Summary
                  </button>
                </>
              )}

              {note.status === "failed" && (
                <div className="text-red-600 text-center font-semibold">
                  Failed. Try again.
                </div>
              )}

              {pdfUrl(note) && (
                <a
                  href={pdfUrl(note)!}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-4 text-indigo-600 font-semibold text-center"
                >
                  <FaEye className="inline mr-2" />
                  Open PDF
                </a>
              )}
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
