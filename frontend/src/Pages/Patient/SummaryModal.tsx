import React from "react";
import { FaTimes, FaBookOpen, FaLightbulb } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SummaryModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  summary?: string;
  keyPoints?: string[];
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  open,
  onClose,
  title = "Summary",
  summary = "",
  keyPoints = [],
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl px-4">
      {/* Modal Card with Glassmorphism & Elevated Shadow */}
      <div className="bg-white/95 backdrop-blur-2xl w-full max-w-5xl rounded-3xl shadow-2xl ring-1 ring-white/20 overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-10 py-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="relative flex items-center justify-between">
            <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{title}</ReactMarkdown>
            </h2>
            <button
              onClick={onClose}
              className="p-4 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-md group"
              aria-label="Close"
            >
              <FaTimes className="text-white group-hover:scale-110 transition-transform" size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-10 max-h-[75vh] overflow-y-auto custom-scrollbar space-y-12">
          {/* Full Summary Section */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-indigo-100 rounded-2xl shadow-md">
                <FaBookOpen className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Full Summary</h3>
            </div>

            <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-3xl p-8 border border-indigo-100 shadow-inner">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {summary ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
                ) : (
                  <p className="text-center text-gray-400 italic py-12 bg-white/60 rounded-2xl">
                    Summary not available yet.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Key Points Section */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-amber-100 rounded-2xl shadow-md">
                <FaLightbulb className="text-amber-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Key Points</h3>
            </div>

            {Array.isArray(keyPoints) && keyPoints.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-start gap-5">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 font-medium leading-relaxed">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50/60 rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-400 italic">No key points generated.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;