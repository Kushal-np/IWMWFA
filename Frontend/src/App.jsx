import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ Components/ProtectedRoute';
import AuthenticationPage from './Pages/AuthPage/AuthenticationPage';
import Dash from './Pages/Dash/Dash';
import LandingPage from "./Pages/LandingPage"
import UnAuthorized from './ Components/UnAuthorized';
import Schedule from './Pages/SchedulePages/Schedule';
import AuthSchedule from './Pages/SchedulePages/AuthSchedule';
import AboutPage from './Pages/AboutPage/About';
function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="/schedule" element={<Schedule/>} />
        <Route path = "/authSchedule" element={<AuthSchedule/>} />
        <Route path ="/about" element={<AboutPage/>} />
        <Route 
          path="/home" 
          element={
              <LandingPage />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dash />
            </ProtectedRoute>
          } 
        />

        {/* Admin Only Routes */}
        {/* <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        /> */}

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;