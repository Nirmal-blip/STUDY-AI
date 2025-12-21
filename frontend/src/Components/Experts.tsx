import React from 'react';
import {
  FaStar,
  FaBrain,
  FaCertificate,
  FaVideo
} from 'react-icons/fa';

import tutor1 from '../assets/image.png';
import tutor2 from '../assets/image1.jpg';
import tutor3 from '../assets/image2.jpg';

const tutors = [
  {
    name: "AI Tutor – Core Concepts",
    specialty: "Textbook Grounded AI",
    img: tutor1,
    experience: "Always Available",
    rating: 4.9,
    learners: "10K+",
    description:
      "An AI tutor trained to explain concepts strictly from your uploaded PDFs, ensuring zero hallucinations and maximum accuracy.",
    specializations: ["Concept Clarity", "Exam Focus", "Source-Based Answers"]
  },
  {
    name: "AI Tutor – Video Companion",
    specialty: "YouTube-Aware AI",
    img: tutor2,
    experience: "Real-Time Understanding",
    rating: 4.8,
    learners: "8K+",
    description:
      "Understands YouTube lecture transcripts and helps you ask precise questions directly from video content.",
    specializations: ["Lecture Breakdown", "Timestamp Context", "Revision Help"]
  },
  {
    name: "AI Tutor – Audio & Visual",
    specialty: "Multimodal Learning AI",
    img: tutor3,
    experience: "Smart Learning",
    rating: 4.9,
    learners: "12K+",
    description:
      "Delivers teacher–student audio conversations and concise video summaries for fast and engaging learning.",
    specializations: ["Audio Dialogue", "Video Summaries", "Quick Revision"]
  }
];

export const Experts: React.FC = () => {
  return (
    <section
      id="tutors"
      className="section-padding bg-gradient-to-br from-indigo-50 to-white"
    >
      <div className="container-padding landing-padding-lg">
        {/* Heading */}
        <div className="text-center mb-20 animate-slide-down">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-secondary">
            Your AI Learning Companions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the AI-powered tutors designed to help you understand, revise,
            and master concepts using your own study materials.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-responsive-lg">
          {tutors.map((tutor, index) => (
            <div
              key={index}
              className="group card card-hover p-8 text-center relative overflow-hidden animate-fade-scale"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full transform translate-x-10 -translate-y-10 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

              {/* Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <img
                    src={tutor.img}
                    alt={tutor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Active indicator */}
                <div className="absolute bottom-2 right-1/2 transform translate-x-16 w-6 h-6 bg-indigo-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                {tutor.name}
              </h3>

              <div className="flex items-center justify-center mb-4">
                <FaBrain className="text-indigo-500 mr-2" />
                <p className="text-indigo-600 font-semibold text-lg">
                  {tutor.specialty}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 font-medium">
                  {tutor.rating}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Mode</div>
                  <div className="font-bold text-indigo-600">
                    {tutor.experience}
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Learners</div>
                  <div className="font-bold text-indigo-600">
                    {tutor.learners}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {tutor.description}
              </p>

              {/* Specializations */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Strengths:
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {tutor.specializations.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-xs font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20 animate-slide-up">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border border-indigo-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want a Personalized AI Tutor?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Upload your study material and let the AI adapt explanations
              specifically for your syllabus and exam needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all">
                Start Studying
              </button>
              <button className="px-6 py-3 rounded-xl border-2 border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-all">
                See How It Works
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
