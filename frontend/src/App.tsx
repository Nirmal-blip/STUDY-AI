import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LandingPage from './Pages/LandingPage'

// Patient Pages

import ConsultationHistory from "./Pages/Patient/ConsultationHistory"
import AiTutor from "./Pages/Patient/AiTutor"

import StudentDashboard from './Pages/Patient/StudentDashboard'


import VideoSummaries from './Pages/Patient/VideoSummaries'
import Settings from './Pages/Patient/Settings'
import Notifications from './Pages/Patient/Upload'



// Auth Pages
import SignupPage from './Pages/SignupPage'
import SigninPage from './Pages/SigninPage'

import ProtectedRoute from './Components/ProtectedRoute'

const App: React.FC = () => {
  return (
    <>
        <Routes>
            {/* Public routes */}
            <Route path='/' element={<LandingPage />}></Route>
            <Route path='/signup' element={<SignupPage />}></Route>
            <Route path='/signin' element={<SigninPage />}></Route>

            {/* Protected routes */}
          
            <Route path='/study-sessions' element={<ConsultationHistory />}></Route>
            {/* <Route path='/doctors-list' element={<ProtectedRoute><DoctorsList /></ProtectedRoute>}></Route> */}
            <Route path='/ai-chat' element={<AiTutor />}></Route>
            {/* <Route path='/patient/doctors' element={<ProtectedRoute><DoctorsList /></ProtectedRoute>}></Route> */}
            {/* <Route path='/medicine-recommendation' element={<ProtectedRoute><MedicineRecommendation /></ProtectedRoute>}></Route> */}
           
            {/* <Route path='/patient-dashboard' element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>}></Route> */}
            <Route path='/student-dashboard' element={<StudentDashboard />}></Route>
            
          
            <Route path='/video-summaries' element={<VideoSummaries />}></Route>
            <Route path='/settings' element={<Settings />}></Route>
            <Route path='/upload' element={<Notifications />}></Route>
         
        </Routes>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    </>
  )
}

export default App
