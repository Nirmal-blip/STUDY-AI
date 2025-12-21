import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Chatbot from "../../Components/Chatbot";
import Sidebar from "../../Components/Sidebar";
import {
  FaBrain,
  FaGraduationCap,
  FaQuestionCircle,
  FaRocket,
  FaArrowLeft,
} from "react-icons/fa";

const AiTutorPage: React.FC = () => {
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      {/* FLOATING BACKGROUND ICONS */}
      <motion.div
        className="absolute top-20 left-10 text-indigo-300 hidden lg:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <FaGraduationCap size={36} />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-12 text-purple-300 hidden lg:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <FaQuestionCircle size={36} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-pink-300 hidden lg:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
      >
        <FaRocket size={36} />
      </motion.div>

      {/* BACK BUTTON (shifted after sidebar) */}
      <motion.button
        onClick={() => {
          window.speechSynthesis.cancel();
          setIsAiSpeaking(false);
          navigate(-1);
        }}
        className="fixed top-4 left-4 lg:left-[20rem] z-20 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition border border-white/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="text-gray-700 text-xl" />
      </motion.button>

      {/* MAIN CONTENT */}
      <main className="lg:ml-80 px-4 py-10 flex justify-center">
        {/* MAIN CARD */}
        <div className="w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 border border-white/40 relative z-10">
          <div className="flex flex-col items-center">
            {/* STATUS */}
            <div className="mt-5 flex items-center gap-3 text-indigo-600 font-semibold text-2xl">
              <FaBrain className={isAiSpeaking ? "animate-pulse" : ""} />
              {isAiSpeaking ? "AI is explaining..." : "AI Tutor is ready to help"}
            </div>

            <p className="text-gray-500 text-sm mt-1 text-center">
              Ask questions only from your uploaded PDFs & videos
            </p>

            {/* AI AVATAR */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isAiSpeaking ? "speaking" : "idle"}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 mt-10 p-1 shadow-indigo-400 shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={isAiSpeaking ? "/ai-talking.gif" : "/idle-ai.png"}
                      alt="AI Tutor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {isAiSpeaking && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-indigo-400/20 blur-xl"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* CHATBOT */}
            <div className="w-full mt-10">
              <Chatbot
                embedded
                // defaultOpen
                onAiStart={() => setIsAiSpeaking(true)}
                onAiEnd={() => setIsAiSpeaking(false)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiTutorPage;
