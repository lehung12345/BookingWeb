import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DoctorFooter from './components/DoctorFooter';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// User pages
import Home from './pages/user/Home';
import DoctorList from './pages/user/DoctorList';
import DoctorDetail from './pages/user/DoctorDetail';
import MyAppointments from './pages/user/MyAppointments';
import Profile from './pages/user/Profile';

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorAppointments from './pages/doctor/DoctorAppointments';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminSpecialties from './pages/admin/AdminSpecialties';
import AdminAppointments from './pages/admin/AdminAppointments';

import './App.css';

// Wrapper component to handle auth-dependent redirects
const AuthRedirect = ({ children }) => {
  const { isAuthenticated, isDoctor, isAdmin } = useAuth();

  if (isAuthenticated && isDoctor) return <Navigate to="/doctor/dashboard" replace />;
  if (isAuthenticated && isAdmin) return <Navigate to="/admin/dashboard" replace />;

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
      <Route path="/doctors" element={<><Navbar /><DoctorList /><Footer /></>} />
      <Route path="/doctor/:id" element={<><Navbar /><DoctorDetail /><Footer /></>} />

      {/* Auth */}
      <Route path="/login" element={<AuthRedirect><><Navbar /><Login /><Footer /></></AuthRedirect>} />
      <Route path="/admin/login" element={<AuthRedirect><AdminLogin /></AuthRedirect>} />
      <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />

      {/* User */}
      <Route path="/my-appointments" element={
        <ProtectedRoute roles={['USER']}>
          <Navbar /><MyAppointments /><Footer />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute roles={['USER']}>
          <Navbar /><Profile /><Footer />
        </ProtectedRoute>
      } />

      {/* Doctor */}
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute roles={['DOCTOR']}>
          <Navbar /><DoctorDashboard /><DoctorFooter />
        </ProtectedRoute>
      } />
      <Route path="/doctor/schedule" element={
        <ProtectedRoute roles={['DOCTOR']}>
          <Navbar /><DoctorSchedule /><DoctorFooter />
        </ProtectedRoute>
      } />
      <Route path="/doctor/appointments" element={
        <ProtectedRoute roles={['DOCTOR']}>
          <Navbar /><DoctorAppointments /><DoctorFooter />
        </ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['ADMIN']}>
          <Navbar /><AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['ADMIN']}>
          <Navbar /><AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/doctors" element={
        <ProtectedRoute roles={['ADMIN']}>
          <Navbar /><AdminDoctors />
        </ProtectedRoute>
      } />
      <Route path="/admin/specialties" element={
        <ProtectedRoute roles={['ADMIN']}>
          <Navbar /><AdminSpecialties />
        </ProtectedRoute>
      } />
      <Route path="/admin/appointments" element={
        <ProtectedRoute roles={['ADMIN']}>
          <Navbar /><AdminAppointments />
        </ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
