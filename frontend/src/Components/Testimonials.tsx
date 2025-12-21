import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuoteLeft, FaStar, FaBrain } from 'react-icons/fa';

const testimonials = [
  {
    name: "Aarav S.",
    role: "College Student",
    quote:
      "This tool completely changed how I study. Asking questions directly from my PDF and getting clear, source-based answers feels like having a personal tutor.",
    rating: 5,
    feature: "PDF-based Q&A",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face&auto=format"
  },
  {
    name: "Riya M.",
    role: "Competitive Exam Aspirant",
    quote:
      "The audio teacher–student conversations helped me revise concepts while commuting. The explanations are simple and exam-focused.",
    rating: 5,
    feature: "Audio Dialogue Mode",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face&auto=format"
  },
  {
    name: "Kunal P.",
    role: "Engineering Student",
    quote:
      "Video summaries are a game changer. I can revise an entire chapter in minutes without missing important points.",
    rating: 5,
    feature: "Video Summaries",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format"
  }
];

export const Testimonials: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding bg-gradient-to-br from-white to-indigo-50">
      <div className="container-padding landing-padding-lg">
        {/* Heading */}
        <div className="text-center mb-20 animate-slide-down">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mb-6">
            <FaBrain className="text-white text-2xl" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-secondary">
            Stories from Our Learners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how students are transforming their learning experience using
            source-grounded AI, inspired by NotebookLM.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-responsive-lg">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group card card-hover p-8 text-left relative overflow-hidden animate-fade-scale"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-indigo-200 group-hover:text-indigo-300 transition-colors duration-300">
                <FaQuoteLeft size={24} />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center space-x-1 mr-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  • {testimonial.feature}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 font-medium italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200 mr-4 group-hover:border-indigo-300 transition-colors duration-300">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Hover underline */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 animate-slide-up">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-indigo-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  15K+
                </div>
                <div className="text-gray-600 font-medium">Active Learners</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  4.9/5
                </div>
                <div className="text-gray-600 font-medium">Average Rating</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  PDFs + Videos
                </div>
                <div className="text-gray-600 font-medium">Source Coverage</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-gray-600 font-medium">AI Tutor Access</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 animate-slide-up">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Learn Smarter?
          </h3>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of learners using AI to understand concepts faster
            and revise more effectively.
          </p>
          <button
            onClick={() => navigate('/study')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
          >
            Start Studying Now
          </button>
        </div>
      </div>
    </section>
  );
};
