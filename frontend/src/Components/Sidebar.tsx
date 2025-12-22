import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaThLarge,
  FaRobot,
  FaCalendarAlt,
  FaFileAlt,
  FaHistory,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaBrain,
  FaUpload,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: <FaThLarge />, path: '/student-dashboard' },
  { name: 'AI Tutor', icon: <FaRobot />, path: '/ai-chat' },
  { name: 'PDF/Notes Summaries', icon: <FaCalendarAlt />, path: '/study-sessions' },
  { name: 'Video Summaries', icon: <FaFileAlt />, path: '/video-summaries' },
  { name: 'Uploads', icon: <FaUpload />, path: '/upload' },
];

const bottomMenuItems: MenuItem[] = [
  { name: 'Settings', icon: <FaCog />, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setShowLogoutModal(false);
      setIsMobileMenuOpen(false);
    }
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden p-3 bg-white rounded-full shadow-lg text-indigo-600 hover:bg-indigo-50 transition-all"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Desktop Sidebar (fixed left) */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen w-80 flex-col py-6 
        bg-gradient-to-b from-white via-indigo-50 to-purple-50 
        shadow-2xl z-40 overflow-y-auto transition-all duration-300"
      >
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-12 px-6 group">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <FaBrain className="text-white text-xl" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Study AI
          </span>
        </div>

        {/* Main Menu */}
        <nav className="flex-grow px-6">
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center p-4 rounded-xl transition-all duration-300 group ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-md'
                  }`}
                >
                  <span
                    className={`mr-4 text-xl ${
                      isActive(item.path) ? 'text-white' : 'text-indigo-600 group-hover:text-indigo-700'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-semibold text-sm">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div className="my-8 px-6">
          <div className="h-px bg-gradient-to-r from-indigo-200 to-purple-200" />
        </div>

        {/* Bottom Menu */}
        <div className="px-6">
          <ul className="space-y-3">
            {bottomMenuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-indigo-200 hover:text-indigo-800'
                  }`}
                >
                  <span className="mr-4 text-xl text-indigo-600">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.name}</span>
                </NavLink>
              </li>
            ))}

            {/* Logout */}
            <li>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center p-3 rounded-xl text-red-600 hover:bg-red-100 transition-all duration-300 border border-red-200 cursor-pointer"
              >
                <span className="mr-4 text-xl">
                  <FaSignOutAlt />
                </span>
                <span className="font-semibold text-sm">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={closeMenu}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-0 left-0 h-full w-80 bg-gradient-to-b from-white via-indigo-50 to-purple-50 shadow-2xl transform transition-transform duration-500 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } overflow-y-auto`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-indigo-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <FaBrain className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Study
              </span>
            </div>
            <button onClick={closeMenu} className="p-2 text-gray-700 hover:text-indigo-600">
              <FaTimes size={24} />
            </button>
          </div>

          {/* Main Menu */}
          <nav className="px-6 py-8">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={closeMenu}
                    className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                    }`}
                  >
                    <span className="mr-4 text-2xl">{item.icon}</span>
                    <span className="font-medium text-base">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Divider */}
          <div className="px-6">
            <div className="h-px bg-gradient-to-r from-indigo-200 to-purple-200" />
          </div>

          {/* Bottom Menu */}
          <div className="px-6 py-8">
            <ul className="space-y-4">
              {bottomMenuItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={closeMenu}
                    className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-indigo-200 hover:text-indigo-800'
                    }`}
                  >
                    <span className="mr-4 text-2xl">{item.icon}</span>
                    <span className="font-medium text-base">{item.name}</span>
                  </NavLink>
                </li>
              ))}

              {/* Logout */}
              <li>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center p-4 rounded-xl text-red-600 hover:bg-red-100 transition-all duration-300 border border-red-200"
                >
                  <span className="mr-4 text-2xl">
                    <FaSignOutAlt />
                  </span>
                  <span className="font-medium text-base">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
};

export default Sidebar;