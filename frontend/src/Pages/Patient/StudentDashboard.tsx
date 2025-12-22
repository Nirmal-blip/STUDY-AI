import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import {
  FaCalendar,
  FaUsers,
  FaStar,
  FaBrain,
  FaBookOpen,
  FaRobot,
  FaUpload,
  FaVideo,
} from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import Chatbot from "../../Components/Chatbot";
import Sidebar from "../../Components/Sidebar";
import girlImage from "../../assets/girl.png";

interface Feature {
  title: string;
  desc: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

interface User {
  name?: string;
  fullname?: string;
  email?: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  /* ===============================
     AUTH USER
     =============================== */
  const [studentName, setStudentName] = useState<string>("Student");

  /* ===============================
     DASHBOARD STATS
     =============================== */
  const [stats, setStats] = useState({
    pdfs: 0,
    videos: 0,
    summaries: 0,
    chats: 0,
  });

  /* ===============================
     FETCH LOGGED IN USER
     =============================== */
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiClient.get("/api/auth/me", {
          withCredentials: true,
        });

        const user: User = res.data.user || res.data;

        const name =
          user.fullname ||
          user.name ||
          user.email?.split("@")[0] ||
          "Student";

        setStudentName(name);
      } catch (error) {
        console.error("Failed to load user", error);
      }
    };

    fetchMe();
  }, []);

  /* ===============================
     FETCH DASHBOARD STATS
     =============================== */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [docsRes, videoRes, chatRes] = await Promise.all([
          apiClient.get("/api/upload/documents", { withCredentials: true }),
          apiClient.get("/api/video", { withCredentials: true }),
          apiClient.get("/api/chat/messages/count", {
            withCredentials: true,
          }),
        ]);

        const documents = docsRes.data.documents || [];
        const videos = videoRes.data.videos || [];

        const summariesCount =
          documents.filter((d: any) => d.summaryGenerated).length +
          videos.filter((v: any) => v.summaryGenerated).length;

        setStats({
          pdfs: documents.length,
          videos: videos.length,
          summaries: summariesCount,
          chats: chatRes.data.count || 0,
        });
      } catch (error) {
        console.error("Dashboard stats error", error);
      }
    };

    fetchStats();
  }, []);

  /* ===============================
     QUICK FEATURES
     =============================== */
  const features: Feature[] = [
    {
      title: "Upload Study Material",
      desc: "Upload PDFs or YouTube videos",
      icon: <FaUpload className="w-8 h-8" />,
      route: "/upload",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "AI Tutor Chat",
      desc: "Ask questions from your notes",
      icon: <FaRobot className="w-8 h-8" />,
      route: "/ai-chat",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Smart Summaries",
      desc: "Generate exam-focused summaries",
      icon: <FaBookOpen className="w-8 h-8" />,
      route: "/study-sessions",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Sidebar />

      <main className="lg:ml-80 px-4 lg:px-8 xl:px-10 overflow-y-auto min-h-screen">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 mt-6 shadow-xl">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <FaBrain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    Hello {studentName} 👋
                  </h1>
                  <p className="text-indigo-100">
                    Ready to study smarter today?
                  </p>
                </div>
              </div>

              <p className="text-lg text-white/90 mb-6">
                Your personal AI study assistant to help you learn faster.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/upload")}
                  className="bg-white/20 text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition flex items-center gap-2"
                >
                  <FaUpload />
                  Upload Notes / Videos
                </button>

                <button
                  onClick={() => navigate("/ai-chat")}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-2xl hover:bg-indigo-50 transition flex items-center gap-2"
                >
                  <FaRobot />
                  Ask AI
                </button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src={girlImage}
                alt="AI Study"
                className="w-64 xl:w-80 object-cover"
              />
            </div>
          </div>
        </section>

        {/* ================= QUICK ACTIONS ================= */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Quick Actions
              </h2>
              <p className="text-gray-600">
                Everything you need for smart learning
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <FaShield />
              <span>Private & Secure</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.route)}
                className="cursor-pointer p-8 rounded-3xl bg-white shadow hover:shadow-xl transition"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6 text-white`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-indigo-600 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Chatbot />
      </main>
    </div>
  );
};

export default StudentDashboard;
