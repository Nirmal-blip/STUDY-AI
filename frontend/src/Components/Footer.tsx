import React from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaBrain,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp,
  FaBookOpen,
  FaYoutube,
  FaShieldAlt
} from 'react-icons/fa';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "About", href: "#about" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Features", href: "#features" },
        { name: "AI Tutors", href: "#tutors" },
        { name: "Blog", href: "#" }
      ]
    },
    {
      title: "Learning",
      links: [
        { name: "PDF Learning", href: "#features" },
        { name: "YouTube Learning", href: "#features" },
        { name: "Audio Dialogues", href: "#features" },
        { name: "Video Summaries", href: "#features" },
        { name: "Exam Prep", href: "#features" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#faq" },
        { name: "FAQs", href: "#faq" },
        { name: "Contact", href: "#" },
        { name: "Feedback", href: "#" },
        { name: "Status", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Data Security", href: "#" },
        { name: "Responsible AI", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, href: "#", label: "Facebook" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-400 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400 rounded-full animate-float-delayed"></div>
      </div>

      <div className="container-padding landing-padding-lg relative">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Brand */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                  <FaBrain className="text-white text-2xl" />
                </div>
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 font-secondary">
                  AI Study Tool
                </span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                A NotebookLM-inspired learning platform that transforms PDFs and
                YouTube lectures into an interactive, source-grounded AI tutor.
              </p>

              {/* Contact */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <FaEnvelope className="mr-3 text-indigo-400" />
                  <span>support@aistudytool.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FaMapMarkerAlt className="mr-3 text-indigo-400" />
                  <span>Built for learners worldwide 🌍</span>
                </div>
              </div>

              {/* Social */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-500 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerSections.map((section, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-bold text-white mb-4">
                      {section.title}
                    </h4>
                    <ul className="space-y-3">
                      {section.links.map((link, i) => (
                        <li key={i}>
                          <a
                            href={link.href}
                            className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 block"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Highlight Section */}
          <div className="mt-16 pt-12 border-t border-gray-700">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="text-gray-300">
                <FaBookOpen className="text-indigo-400 text-3xl mx-auto mb-3" />
                <p className="font-semibold">PDF-Grounded Learning</p>
              </div>
              <div className="text-gray-300">
                <FaYoutube className="text-indigo-400 text-3xl mx-auto mb-3" />
                <p className="font-semibold">YouTube-Aware AI</p>
              </div>
              <div className="text-gray-300">
                <FaShieldAlt className="text-indigo-400 text-3xl mx-auto mb-3" />
                <p className="font-semibold">Secure & Private</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>
                &copy; {new Date().getFullYear()} AI Study Tool. All rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>📘 Source-Grounded</span>
                <span>🤖 AI Tutor</span>
                <span>⭐ 4.9 Learner Rating</span>
              </div>

              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                aria-label="Scroll to top"
              >
                <FaArrowUp />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
