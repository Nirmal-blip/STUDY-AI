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
    FaUpload
} from "react-icons/fa";
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';

interface MenuItem {
    name: string;
    icon: React.ReactNode;
    path: string;
}

const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: <FaThLarge />, path: "/student-dashboard" },
    { name: "AI Tutor", icon: <FaRobot />, path: "/ai-chat" },
    { name: "PDF/Notes Summaries", icon: <FaCalendarAlt />, path: "/study-sessions" },
    { name: "Video Summaries", icon: <FaFileAlt />, path: "/video-summaries" },
    // { name: "Study History", icon: <FaHistory />, path: "/study-history" },
    { name: "Uploads", icon: <FaUpload />, path: "/upload" },
];

const bottomMenuItems: MenuItem[] = [
    { name: "Settings", icon: <FaCog />, path: "/settings" },
];

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const handleLogoutConfirm = async () => {
        try {
            await logout();
            toast.success("Logged out successfully!");
            navigate('/');
        } catch (error) {
            toast.error("Logout failed");
        } finally {
            setShowLogoutModal(false);
        }
    };

    return (
        <aside className="w-80 fixed left-0 top-0 h-screen flex-col py-6 
        bg-gradient-to-b from-white via-indigo-50 to-purple-50 
        shadow-xl z-50 hidden lg:flex">

            {/* LOGO */}
            <div className="flex items-center space-x-3 mb-10 px-6 group">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <FaBrain className="text-white text-xl" />
                </div>
                <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    AI Study
                </span>
            </div>

            {/* MAIN MENU */}
            <nav className="flex-grow px-6">
                <ul className="space-y-3">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={`flex items-center p-4 rounded-xl transition-all duration-300 group ${
                                    isActive(item.path)
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
                                        : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-md'
                                }`}
                            >
                                <span className={`mr-4 text-xl ${
                                    isActive(item.path)
                                        ? 'text-white'
                                        : 'text-indigo-600 group-hover:text-indigo-700'
                                }`}>
                                    {item.icon}
                                </span>
                                <span className="font-semibold text-sm">
                                    {item.name}
                                </span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* DIVIDER */}
            <div className="my-6 px-6">
                <div className="h-px bg-gradient-to-r from-indigo-200 to-purple-200"></div>
            </div>

            {/* BOTTOM MENU */}
            <div className="bg-indigo-50 px-6">
                <ul className="space-y-3">
                    {bottomMenuItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                                    isActive(item.path)
                                        ? 'bg-indigo-500 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-indigo-200 hover:text-indigo-800'
                                }`}
                            >
                                <span className="mr-4 text-xl text-indigo-600">
                                    {item.icon}
                                </span>
                                <span className="font-semibold text-sm">
                                    {item.name}
                                </span>
                            </NavLink>
                        </li>
                    ))}

                    {/* LOGOUT */}
                    <li>
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="w-full flex items-center p-3 rounded-xl 
                            text-red-600 hover:bg-red-100 transition-all duration-300
                            border border-red-200 cursor-pointer"
                        >
                            <span className="mr-4 text-xl">
                                <FaSignOutAlt />
                            </span>
                            <span className="font-semibold text-sm">
                                Logout
                            </span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* LOGOUT MODAL */}
            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                confirmText="Logout"
                cancelText="Cancel"
            />
        </aside>
    );
};

export default Sidebar;
