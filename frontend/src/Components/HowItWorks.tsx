import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUpload,
  FaSearch,
  FaBrain,
  FaHeadphones,
  FaVideo,
  FaArrowRight
} from 'react-icons/fa';

const steps = [
  {
    title: "Upload Your Study Material",
    description: "Add textbook PDFs or provide YouTube lecture links as learning sources.",
    icon: <FaUpload />,
    color: "from-indigo-500 to-purple-500"
  },
  {
    title: "Ask Questions Freely",
    description: "Ask anything and get answers strictly grounded in your provided content.",
    icon: <FaSearch />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Learn with AI Tutor",
    description: "Understand concepts through NotebookLM-style AI explanations.",
    icon: <FaBrain />,
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "Audio & Video Learning",
    description: "Listen to teacher–student dialogues and watch concise video summaries.",
    icon: <FaHeadphones />,
    color: "from-indigo-400 to-blue-500"
  }
];

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-padding landing-padding-lg">
        {/* Heading */}
        <div className="text-center mb-20 animate-slide-down">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-secondary">
            How the AI Study Tool Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Learn smarter in a few simple steps using a NotebookLM-inspired,
            source-grounded AI learning experience.
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-400 to-indigo-200 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-4 gap-responsive">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group animate-fade-scale"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Icon + Step Number */}
                <div className="flex flex-col items-center mb-8">
                  <div
                    className={`relative w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-all duration-300 mb-4 z-10`}
                  >
                    {step.icon}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-700 shadow-md">
                      {index + 1}
                    </div>
                  </div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-10 -right-4 text-indigo-400 animate-pulse">
                      <FaArrowRight size={20} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="card card-hover py-10 px-8 h-[18rem] text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Stack */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-fade-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card card-hover p-8">
                <div className="flex items-start space-x-6">
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xl shadow-lg relative`}
                  >
                    {step.icon}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-700 shadow-md">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Connector */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-400 to-indigo-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20 animate-slide-up">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Study Smarter with AI?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Turn your PDFs and videos into an interactive AI tutor experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/study')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
              >
                Start Studying
              </button>
              <button className="px-6 py-3 rounded-xl border-2 border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
