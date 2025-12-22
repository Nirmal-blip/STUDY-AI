import React, { useState } from 'react';
import {
  FaPlus,
  FaMinus,
  FaQuestionCircle,
  FaShieldAlt,
  FaBookOpen,
  FaYoutube,
  FaBrain,
  FaClock
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const faqData = [
  {
    question: "How does this AI study tool work?",
    answer:
      "You upload textbook PDFs or provide YouTube lecture links. The system indexes this content and allows you to ask questions. Answers are generated strictly from your provided sources, inspired by NotebookLM’s source-grounded approach.",
    icon: <FaBrain />,
    category: "How It Works"
  },
  {
    question: "Can I ask questions from my own PDF chapters?",
    answer:
      "Yes. You can upload your own chapters, notes, or study material. The AI will only use this content to answer your questions, ensuring accuracy and zero hallucination.",
    icon: <FaBookOpen />,
    category: "PDF Learning"
  },
  {
    question: "How are YouTube videos used?",
    answer:
      "The system extracts transcripts from YouTube lecture videos and treats them as learning sources. You can ask questions directly related to video explanations and concepts discussed by the instructor.",
    icon: <FaYoutube />,
    category: "Video Learning"
  },
  {
    question: "Is my data and study material secure?",
    answer:
      "Yes. Your uploaded PDFs, queries, and interactions are stored securely. We follow industry-standard security practices and do not share your data with third parties.",
    icon: <FaShieldAlt />,
    category: "Privacy & Security"
  },
  {
    question: "What is the audio dialogue mode?",
    answer:
      "Audio dialogue mode presents concepts as a natural teacher–student conversation. This helps with revision, understanding complex topics, and learning while multitasking.",
    icon: <FaBrain />,
    category: "Audio Learning"
  },
  {
    question: "Can I use this tool for exam preparation?",
    answer:
      "Absolutely. The platform is designed for exam-oriented learning, offering concise explanations, audio discussions, and video summaries focused on key concepts and revision.",
    icon: <FaClock />,
    category: "Exams"
  }
];

const FAQItem: React.FC<{ item: typeof faqData[0]; index: number }> = ({
  item,
  index
}) => {
  const [isOpen, setIsOpen] = useState(false);
 
  return (
    
    <div
      className="card mb-4 overflow-hidden animate-fade-scale"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex justify-between items-start text-left hover:bg-indigo-50 transition-all duration-300 group"
      >
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
            {item.icon}
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium text-indigo-600 mb-1">
              {item.category}
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
              {item.question}
            </h3>
          </div>
        </div>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ml-4 transition-all duration-300 ${
            isOpen
              ? 'bg-indigo-500 text-white rotate-180'
              : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200'
          }`}
        >
          {isOpen ? <FaMinus size={14} /> : <FaPlus size={14} />}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          <div className="pl-14">
            <p className="text-gray-600 leading-relaxed">{item.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section
      id="faq"
      className="section-padding bg-gradient-to-br from-indigo-50 to-white"
    >
      
      <div className="container-padding landing-padding-lg">
        {/* Heading */}
        <div className="text-center mb-20 animate-slide-down">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mb-6">
            <FaQuestionCircle className="text-white text-2xl" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-secondary">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Common questions about how this NotebookLM-inspired AI study tool
            helps you learn smarter and faster.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {faqData.map((item, index) => (
            <FAQItem key={index} item={item} index={index} />
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-20 animate-slide-up">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-indigo-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Explore the platform, upload your study material, and experience
              AI-powered learning grounded in your own sources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/signin')}  
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all">
                Start Studying
              </button>
         
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
