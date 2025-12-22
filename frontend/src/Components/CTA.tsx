import React from 'react';
import {
  FaArrowRight,
  FaLaptop,
  FaShieldAlt,
  FaClock,
  FaBrain
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
export const CTA: React.FC = () => {
  const features = [
    { icon: <FaLaptop />, text: "Web-Based Learning" },
    { icon: <FaShieldAlt />, text: "Your Data, Fully Private" },
    { icon: <FaClock />, text: "Learn Anytime, Anywhere" }
  ];
const navigate=useNavigate()
  return (
    <section className="section-padding bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full animate-pulse-slow"></div>
      </div>

      <div className="container-padding landing-padding-lg relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
              <FaBrain className="mr-2" />
              NotebookLM-Inspired AI Study Tool
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6 font-secondary">
              Studying shouldn’t be confusing.{' '}
              <span className="text-indigo-200">
                Let AI guide your learning.
              </span>
            </h2>

            <p className="text-indigo-100 text-xl mb-8 leading-relaxed max-w-2xl">
              Upload PDFs, add YouTube lectures, ask questions, listen to
              teacher–student audio dialogues, and revise with concise video
              summaries — all in one intelligent study platform.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mb-10 justify-center lg:justify-start">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-white">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    {feature.icon}
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button onClick={() => navigate('/signin')}className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:scale-105 transition-all">
                Start Studying Now
              </button>

              <button className="px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                View Demo
              </button>
            </div>

            {/* Secondary CTA */}
            <div className="flex items-center justify-center lg:justify-start">
              <button className="group inline-flex items-center text-white font-semibold hover:text-indigo-200 transition-colors duration-300">
                <span>Explore how it works</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Mockup / Preview */}
          <div className="flex justify-center lg:justify-end animate-slide-up">
            <div className="relative">
              {/* App mockup */}
              <div className="w-80 h-96 bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
                    <div className="text-gray-700 font-bold">AI Study Tool</div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </div>

                  {/* Chat card */}
                  <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                    <div className="h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  </div>

                  {/* Source card */}
                  <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mr-3"></div>
                      <div>
                        <div className="h-2 bg-gray-300 rounded w-20 mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-14"></div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <div className="h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl"></div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-white/20 rounded-full animate-float"></div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-20 text-center animate-slide-up">
          <p className="text-indigo-100 mb-6">
            Built for students, learners, and exam aspirants
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-white font-semibold">PDF + YouTube Support</div>
            <div className="text-white font-semibold">AI Tutor Mode</div>
            <div className="text-white font-semibold">Audio + Video Learning</div>
            <div className="text-white font-semibold">Source-Grounded Answers</div>
          </div>
        </div>
      </div>
    </section>
  );
};
