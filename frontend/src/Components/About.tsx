import React from 'react';
import {
  FaBrain,
  FaBookOpen,
  FaHeadphones,
  FaVideo
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
export const About: React.FC = () => {
  const stats = [
    { icon: <FaBookOpen />, number: "PDF + Videos", label: "Source-Based Learning" },
    { icon: <FaBrain />, number: "AI Tutor", label: "Grounded Explanations" },
    { icon: <FaHeadphones />, number: "Audio Mode", label: "Teacher–Student Dialogues" },
    { icon: <FaVideo />, number: "Video", label: "Smart Chapter Summaries" }
  ];
const navigate=useNavigate()
  return (
    <section
      id="about"
      className="section-padding bg-gradient-to-br from-white to-indigo-50"
    >
      <div className="container-padding landing-padding-lg">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-6">
              <FaBrain className="mr-2" />
              About the AI Study Tool
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-secondary">
              Learn Directly From Your
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                {" "}Own Study Material
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              This platform is inspired by NotebookLM and designed to help students
              deeply understand their subjects using AI that is strictly grounded
              in provided PDFs and YouTube videos.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Instead of generic answers, the AI acts like a personal tutor —
              allowing students to ask questions, listen to two-person
              teacher–student conversations, and watch concise video summaries
              focused on exams and clarity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={()=>navigate('/signin')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all">
                Explore Features
              </button>
             
            </div>
          </div>

          {/* RIGHT CONTENT – STATS */}
          <div className="animate-slide-up">
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-indigo-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
