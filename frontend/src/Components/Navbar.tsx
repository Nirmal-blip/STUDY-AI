import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaBrain, FaArrowRight } from 'react-icons/fa';

const StudyNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = [
        'home',
        'about',
        'features',
        'how-it-works',
        'tutors',
        'faq'
      ];

      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'AI Tutors', id: 'tutors' },
    { label: 'FAQ', id: 'faq' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleStartStudying = () => {
    navigate('/signin');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-indigo-100'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <nav className="container-padding landing-padding">
        <div className="flex justify-between items-center py-4 lg:py-6">

          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <FaBrain className="text-white text-xl" />
            </div>
            <span className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 font-secondary">
              AI Study Tool
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 font-medium transition-all duration-300 rounded-lg ${
                  activeSection === item.id
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <button
              className="hidden lg:flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all group"
              onClick={handleStartStudying}
            >
              Start Studying
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2 border-t border-gray-100">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4">
              <button
                onClick={() => {
                  handleStartStudying();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg"
              >
                Start Studying
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default StudyNavbar;
