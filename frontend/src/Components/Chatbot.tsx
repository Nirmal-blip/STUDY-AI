import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faPaperPlane,
  faXmark,
  faPlus,
  faVolumeUp,
  faVolumeMute,
  faUser,
  faCircle,
  faFilePdf,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface DocumentItem {
  _id: string;
  title: string;
}

interface VideoItem {
  _id: string;
  title: string;
  status: "processing" | "ready" | "failed";
}

interface ChatbotProps {
  embedded?: boolean;
  defaultOpen?: boolean;
  onAiStart?: () => void;
  onAiEnd?: () => void;
}

const getStrictFemaleVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v =>
      v.lang.startsWith("en") &&
      (
        v.name.includes("Female") ||
        v.name.includes("Zira") ||
        v.name.includes("Samantha") ||
        v.name.includes("Google UK English Female") ||
        v.name.includes("Microsoft Natasha") ||
        v.name.includes("Microsoft Heera")
      )
    ) || null
  );
};

const Chatbot: React.FC<ChatbotProps> = ({
  embedded = false,
  defaultOpen = false,
  onAiStart,
  onAiEnd,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const [sourceType, setSourceType] = useState<"document" | "video">("document");
  const [selectedDocId, setSelectedDocId] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voicesReady, setVoicesReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVoices = () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoicesReady(true);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isSpeaking]);

  const addMessage = (text: string, sender: "user" | "bot") => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
  };

  useEffect(() => {
    if (!isOpen) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload/documents`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setDocuments(data.documents || []))
      .catch(() => setDocuments([]));

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/video`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setVideos(data.videos || []))
      .catch(() => setVideos([]));
  }, [isOpen]);

  const createSession = async () => {
    if (sourceType === "document" && !selectedDocId) {
      addMessage("⚠️ Please select a PDF document first.", "bot");
      throw new Error("No document selected");
    }

    if (sourceType === "video") {
      const video = videos.find(v => v._id === selectedVideoId);
      if (!video) {
        addMessage("⚠️ Please select a video.", "bot");
        throw new Error("No video selected");
      }
      if (video.status !== "ready") {
        addMessage("⏳ This video is still being transcribed. Please wait a few minutes.", "bot");
        throw new Error("Video not ready");
      }
    }

    const payload = sourceType === "document"
      ? { documentId: selectedDocId }
      : { videoId: selectedVideoId };

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/session`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSessionId(data.sessionId);

    addMessage(
      sourceType === "document"
        ? "📄 **Document loaded.** Ready to answer questions from this PDF!"
        : "🎥 **Video transcript loaded.** Ready to answer from this video!",
      "bot"
    );

    return data.sessionId;
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !voicesReady) return;

    window.speechSynthesis.cancel();
    const femaleVoice = getStrictFemaleVoice();
    if (!femaleVoice) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = femaleVoice;
    utter.rate = 0.95;
    utter.pitch = 1.2;

    utter.onstart = () => {
      setIsSpeaking(true);
      onAiStart?.();
    };
    utter.onend = () => {
      setIsSpeaking(false);
      onAiEnd?.();
    };

    window.speechSynthesis.speak(utter);
  };

  const toggleMute = () => {
    if (voiceEnabled) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onAiEnd?.();
    }
    setVoiceEnabled(prev => !prev);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading || isSpeaking) return;

    const question = userInput.trim();
    setUserInput("");
    addMessage(question, "user");
    setLoading(true);

    try {
      let sid = sessionId;
      if (!sid) sid = await createSession(); // Auto-creates session on first message

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, content: question }),
      });

      const data = await res.json();
      const aiText = data.aiMessage?.content || "⚠️ No response from server.";

      addMessage(aiText, "bot");
      speak(aiText);
    } catch (err) {
      addMessage("❌ Failed to get response. Check your source selection and try again.", "bot");
    } finally {
      setLoading(false);
    }
  };

  const canSend = !!userInput.trim() && !loading && !isSpeaking && (sessionId || (sourceType === "document" ? !!selectedDocId : !!selectedVideoId));

  return (
    <div className={embedded ? "w-full" : "fixed bottom-6 right-6 z-50"}>
      {/* OPENED CHAT WINDOW */}
      {isOpen && (
        <div className="w-full  h-[540px] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl ring-1 ring-white/20 overflow-hidden flex flex-col md:backdrop-blur-2xl
  animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* HEADER */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-5 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10" />
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg">
                  <FontAwesomeIcon icon={faRobot} size="lg" /> 
                </div>
                <div>
                  <h3 className="text-xl font-bold">AI Tutor</h3>
                  <p className="text-white/80 text-sm">
                    {sessionId ? "Active • Answering from content" : "Select source to start"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={toggleMute} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition">
                  <FontAwesomeIcon icon={voiceEnabled ? faVolumeUp : faVolumeMute} />
                </button>
                <button
                  onClick={() => {
                    setSessionId(null);
                    setMessages([]);
                    setSelectedDocId("");
                    setSelectedVideoId("");
                  }}
                  className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition">
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </div>
          </div>

          {/* SOURCE SELECTOR */}
          {!sessionId && (
            <div className="p-5 bg-gradient-to-b from-indigo-50/50 to-transparent border-b border-indigo-100">
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => { setSourceType("document"); setSelectedVideoId(""); }}
                  className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all ${sourceType === "document" ? "bg-indigo-600 text-white shadow-lg" : "bg-white/70 text-gray-700"}`}
                >
                  <FontAwesomeIcon icon={faFilePdf} className="mr-2" /> PDF
                </button>
                <button
                  onClick={() => { setSourceType("video"); setSelectedDocId(""); }}
                  className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all ${sourceType === "video" ? "bg-purple-600 text-white shadow-lg" : "bg-white/70 text-gray-700"}`}
                >
                  <FontAwesomeIcon icon={faVideo} className="mr-2" /> Video
                </button>
              </div>

              <select
                value={sourceType === "document" ? selectedDocId : selectedVideoId}
                onChange={(e) => sourceType === "document" ? setSelectedDocId(e.target.value) : setSelectedVideoId(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/80 backdrop-blur border border-indigo-200 focus:ring-4 focus:ring-indigo-300 focus:border-transparent transition shadow-inner"
              >
                <option value="">Choose {sourceType === "document" ? "a PDF" : "a video"}...</option>
                {(sourceType === "document" ? documents : videos).map(item => (
                  <option
                    key={item._id}
                    value={item._id}
                    disabled={sourceType === "video" && (item as VideoItem).status !== "ready"}
                  >
                    {item.title}
                    {sourceType === "video" && (item as VideoItem).status === "processing" && " (Transcribing...)"}
                    {sourceType === "video" && (item as VideoItem).status === "failed" && " (Failed)"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-5  touch-action-manipulation
  pointer-events-auto space-y-5 bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20">
            {messages.length === 0 && !sessionId && (
              <div className="text-center text-gray-500 mt-10">
                <FontAwesomeIcon icon={faRobot} size="3x" className="mb-4 text-indigo-300" />
                <p>Select a document or video,<br />then ask your first question!</p>
              </div>
            )}

            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom duration-500`}>
                <div className={`max-w-[85%] group relative ${m.sender === "user" ? "order-2" : ""}`}>
                  <div className={`
                    px-5 py-4 rounded-3xl shadow-lg backdrop-blur-sm border
                    ${m.sender === "user"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-teal-400 rounded-tr-none"
                      : "bg-white/90 border-indigo-100 rounded-tl-none"
                    }
                  `}>
                    <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} >
                      {m.text}
                    </ReactMarkdown>

                    {/* ✅ STEP 3 ADD THIS ONLY */}
      {m.sender === "bot" && (
        <button
          onClick={() => speak(m.text)}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            speak(m.text);
          }}
          className="mt-2 text-sm text-indigo-600 lg:hidden hover:text-indigo-800 font-semibold"
        >
          🔊 Listen
        </button>
      )}
                    </div>
                  </div>

                  <div className={`absolute top-0 ${m.sender === "user" ? "-left-10" : "-right-10"}`}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md flex items-center justify-center text-white text-sm">
                      <FontAwesomeIcon icon={m.sender === "user" ? faUser : faRobot} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/90 px-5 py-4 rounded-3xl shadow-lg border border-indigo-100 rounded-tl-none">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200" />
                    <span className="text-indigo-700 ml-2 font-medium">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {isSpeaking && (
              <div className="flex justify-start">
                <div className="bg-indigo-100 px-4 py-2 rounded-full text-indigo-700 text-sm font-medium animate-pulse">
                  🎤 Speaking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR - NOW ALWAYS TYPABLE */}
          <form onSubmit={handleSubmit} className="p-5 bg-white/80 backdrop-blur border-t border-indigo-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder={
                  sessionId
                    ? "Ask a question about the content..."
                    : "Type your question here (select source above first)"
                }
                className="flex-1 px-5 py-4 rounded-2xl bg-white border border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all shadow-inner placeholder:text-gray-400"
                autoFocus
              />
              <button
                type="submit"
                disabled={!canSend}
                className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAB - Closed State */}
      {!isOpen && (
        <div  className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-3xl transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
          <FontAwesomeIcon icon={faRobot} size="xl" className="relative z-10 drop-shadow-md" />
        </button>
        <button
  onClick={() => setIsOpen(true)}
  className="
    px-6 h-12
    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
    text-white
    rounded-xl
    shadow-lg
    flex items-center justify-center gap-2
    font-semibold text-sm
    hover:scale-105 hover:shadow-xl
    transition-all duration-300
    group relative overflow-hidden
  "
>
  {/* shimmer */}
  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

  <span className="relative z-10 tracking-wide">
    Click to open chat
  </span>
</button>

</div>
      )}
    </div>
  );
};

export default Chatbot;