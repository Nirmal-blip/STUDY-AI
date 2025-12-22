import React from 'react';
import {
  FaBookOpen,
  FaLock,
  FaBrain,
  FaHeadphones,
  FaArrowRight,
  FaPlay,
} from 'react-icons/fa';
import studyHero from '../assets/image.png';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <FaBookOpen size={28} />,
    text: 'Source-Based Learning',
    description: 'Answers only from your PDFs & videos',
  },
  {
    icon: <FaLock size={28} />,
    text: 'No Hallucinations',
    description: 'Grounded & reliable responses',
  },
  {
    icon: <FaBrain size={28} />,
    text: 'AI Tutor Mode',
    description: 'Teacher–student conversations',
  },
  {
    icon: <FaHeadphones size={28} />,
    text: 'Audio & Video',
    description: 'Learn by listening & watching',
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-indigo-300 rounded-full opacity-20 blur-xl" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-300 rounded-full opacity-20 blur-xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT - Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mx-auto lg:mx-0">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse" />
              NotebookLM-Inspired Study Tool
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Turn your{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                study material
              </span>{' '}
              into an{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                AI tutor
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Upload chapters and videos, ask questions, listen to teacher–student conversations, and
              watch concise video summaries — all powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/signin')}
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Start Studying
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="group inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300">
                <FaPlay className="mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">PDFs</div>
                <div className="text-sm text-gray-600">Chapter-based</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">Audio</div>
                <div className="text-sm text-gray-600">Dialogue Mode</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">Video</div>
                <div className="text-sm text-gray-600">AI Summaries</div>
              </div>
            </div>
          </div>

          {/* RIGHT - Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] h-[460px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px]">
              <img
                src={studyHero}
                alt="AI Study Assistant"
                className="w-full h-full object-cover rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
              />

              {/* Floating Badge */}
              <div className="absolute -right-4 sm:-right-6 bottom-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg z-20">
                <div className="text-center">
                  <div className="text-base font-bold text-indigo-600">AI Tutor</div>
                  <div className="text-xs text-gray-600">Always Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-20 lg:mt-32">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why This Study Tool?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed for deep understanding, not surface answers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{f.text}</h3>
                <p className="text-gray-600 text-sm">{f.description}</p>
                <div className="w-0 group-hover:w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mt-4 transition-all duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};