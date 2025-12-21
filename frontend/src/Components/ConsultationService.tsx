import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBookOpen,
  FaYoutube,
  FaBrain,
  FaHeadphones,
  FaVideo,
  FaQuestionCircle
} from 'react-icons/fa';

const services = [
  {
    title: "PDF-Based Learning",
    description: "Upload textbook chapters and get explanations grounded only in the content",
    icon: <FaBookOpen />,
    color: "from-indigo-500 to-purple-500"
  },
  {
    title: "YouTube Lecture Understanding",
    description: "Ask questions directly from curated YouTube lecture videos",
    icon: <FaYoutube />,
    color: "from-red-500 to-pink-500"
  },
  {
    title: "AI Tutor (NotebookLM Inspired)",
    description: "Chat with an AI tutor that answers strictly from your sources",
    icon: <FaBrain />,
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "Two-Person Audio Dialogue",
    description: "Learn concepts through natural teacher–student conversations",
    icon: <FaHeadphones />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Video Chapter Summaries",
    description: "Visual explanations and exam-oriented summaries of chapters",
    icon: <FaVideo />,
    color: "from-indigo-400 to-blue-500"
  },
  {
    title: "Ask-Anything Mode",
    description: "Clear doubts instantly with zero hallucinated answers",
    icon: <FaQuestionCircle />,
    color: "from-purple-400 to-pink-500"
  }
];

export const ConsultationService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      id="features"
      className="section-padding bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 bg-white rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-pulse-slow"></div>
      </div>

      <div className="container-padding landing-padding-lg relative">
        {/* Heading */}
        <div className="text-center mb-16 animate-slide-down">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-secondary">
            Smart Study Features
          </h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
            A NotebookLM-inspired AI platform that transforms PDFs and videos
            into an interactive learning experience
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-responsive">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white/85 backdrop-blur-sm p-8 rounded-lg hover:bg-white transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl border border-white/20 animate-fade-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div
                className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} text-white mb-6 text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Hover indicator */}
              <div className="flex items-center text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="text-sm">Explore feature</span>
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 animate-slide-up">
          <p className="text-indigo-100 text-lg mb-6">
            Ready to study smarter with AI?
          </p>
          <button
            onClick={() => navigate('/study')}
            className="px-8 py-4 bg-white transition ease-in-out transform hover:scale-105 duration-500 font-semibold rounded-xl border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            Start Studying Now
          </button>
        </div>
      </div>
    </section>
  );
};
