import React, { useState, useEffect } from 'react'
import Sidebar from '../../Components/Sidebar'
import {
  FaCog,
  FaUser,
  FaBell,
  FaLock,
  FaPalette,
  FaEdit,
  FaSave,
  FaTrash,
  FaDownload,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa'

/* ================= TYPES ================= */

interface ProfileData {
  fullName: string
  email: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  studyReminders: boolean
  examAlerts: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private'
  twoFactorAuth: boolean
}

/* ================= COMPONENT ================= */

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)

  /* ---------- PROFILE STATE ---------- */
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: '',
  })

  /* ---------- NOTIFICATIONS ---------- */
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    studyReminders: true,
    examAlerts: true,
  })

  /* ---------- PRIVACY ---------- */
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'private',
    twoFactorAuth: false,
  })

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            method: 'GET',
            credentials: 'include', // 🔥 IMPORTANT
          }
        )

        const data = await res.json()

        if (data.success) {
          setProfileData({
            fullName: data.user.fullname || '',
            email: data.user.email||'',
          })
        }
      } catch (err) {
        console.error('Failed to load profile', err)
      }
    }

    fetchProfile()
  }, [])

  /* ================= UPDATE PROFILE ================= */

  const handleProfileUpdate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: profileData.fullName,
            email: profileData.email,
          }),
        }
      )

      const data = await res.json()

      if (data.success) {
        setIsEditing(false)
        alert('Profile updated successfully!')
      }
    } catch (err) {
      alert('Failed to update profile')
    }
  }

  /* ================= HELPERS ================= */

  const toggleNotification = (key: keyof NotificationSettings) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))

  const togglePrivacy = (key: keyof PrivacySettings) =>
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }))

  const sections = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'privacy', label: 'Privacy & Security', icon: FaLock },
    { id: 'account', label: 'Account', icon: FaCog },
    { id: 'preferences', label: 'Preferences', icon: FaPalette },
  ]

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Sidebar />

      <main className="lg:ml-80 p-6 lg:p-10">
        {/* HEADER */}
        <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl p-6 shadow-xl">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="opacity-90">Manage your study account</p>
        </div>

        {/* TABS */}
        <div className="mb-8 bg-white p-2 rounded-2xl shadow flex flex-wrap gap-2">
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 font-medium transition ${
                activeSection === sec.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-indigo-50'
              }`}
            >
              <sec.icon />
              {sec.label}
            </button>
          ))}
        </div>

        {/* ================= PROFILE ================= */}
        {activeSection === 'profile' && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Profile Information</h2>
              <button
                onClick={() =>
                  isEditing ? handleProfileUpdate() : setIsEditing(true)
                }
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white flex items-center gap-2"
              >
                {isEditing ? <FaSave /> : <FaEdit />}
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(profileData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    disabled={!isEditing || key === 'email'}
                    value={value}
                    onChange={e =>
                      setProfileData(prev => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border disabled:bg-gray-100"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= NOTIFICATIONS ================= */}
        {activeSection === 'notifications' && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
              >
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <button onClick={() => toggleNotification(key as any)}>
                  {value ? (
                    <FaToggleOn className="text-indigo-500 text-2xl" />
                  ) : (
                    <FaToggleOff className="text-gray-400 text-2xl" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= PRIVACY ================= */}
        {activeSection === 'privacy' && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            {Object.entries(privacy).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
              >
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <button onClick={() => togglePrivacy(key as any)}>
                  {value ? (
                    <FaToggleOn className="text-indigo-500 text-2xl" />
                  ) : (
                    <FaToggleOff className="text-gray-400 text-2xl" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= ACCOUNT ================= */}
        {activeSection === 'account' && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <button className="w-full flex justify-between items-center p-4 rounded-xl bg-indigo-50 text-indigo-700">
              Export Account Data
              <FaDownload />
            </button>

            <button className="w-full flex justify-between items-center p-4 rounded-xl bg-red-50 text-red-600">
              Delete Account
              <FaTrash />
            </button>
          </div>
        )}

        {/* ================= PREFERENCES ================= */}
        {activeSection === 'preferences' && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <select className="w-full px-4 py-3 rounded-xl border">
              <option>English</option>
              <option>Hindi</option>
            </select>

            <select className="w-full px-4 py-3 rounded-xl border">
              <option>Light Mode</option>
              <option>Dark Mode</option>
            </select>
          </div>
        )}
      </main>
    </div>
  )
}

export default Settings
