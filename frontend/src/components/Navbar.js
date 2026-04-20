import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiLogOut, FiUser, FiCalendar, FiGrid, FiHeart } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, isUser, isDoctor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    const isAdminBefore = isAdmin;
    logout();
    if (isAdminBefore) {
      navigate('/admin/login');
    } else {
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FiHeart className="logo-icon" />
          <span>MediBook</span>
        </Link>

        <div className="navbar-links">
          {!isAuthenticated ? (
            <>
              <Link to="/" className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
                <FiHome /> Trang chủ
              </Link>
              <Link to="/doctors" className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}>
                Bác sĩ
              </Link>
              <Link to="/login" className="btn-primary btn-sm">
                Đăng nhập
              </Link>
            </>
          ) : isUser ? (
            <>
              <Link to="/" className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
                <FiHome /> Trang chủ
              </Link>
              <Link to="/doctors" className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}>
                Bác sĩ
              </Link>
              <Link to="/my-appointments" className={`nav-link ${isActive('/my-appointments') ? 'active' : ''}`}>
                <FiCalendar /> Lịch hẹn
              </Link>
              <Link to="/profile" className="nav-user" title="Trang cá nhân">
                <FiUser className="user-icon" />
                <span>{user?.full_name}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                <FiLogOut />
              </button>
            </>
          ) : isDoctor ? (
            <>
              <Link to="/doctor/dashboard" className={`nav-link ${isActive('/doctor/dashboard') ? 'active' : ''}`}>
                <FiGrid /> Dashboard
              </Link>
              <Link to="/doctor/schedule" className={`nav-link ${isActive('/doctor/schedule') ? 'active' : ''}`}>
                <FiCalendar /> Lịch làm việc
              </Link>
              <Link to="/doctor/appointments" className={`nav-link ${isActive('/doctor/appointments') ? 'active' : ''}`}>
                Bệnh nhân
              </Link>
              <div className="nav-user">
                <FiUser className="user-icon" />
                <span>BS. {user?.full_name}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                <FiLogOut />
              </button>
            </>
          ) : isAdmin ? (
            <>
              <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                <FiGrid /> Dashboard
              </Link>
              <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
                Users
              </Link>
              <Link to="/admin/doctors" className={`nav-link ${isActive('/admin/doctors') ? 'active' : ''}`}>
                Bác sĩ
              </Link>
              <Link to="/admin/specialties" className={`nav-link ${isActive('/admin/specialties') ? 'active' : ''}`}>
                Chuyên khoa
              </Link>
              <Link to="/admin/appointments" className={`nav-link ${isActive('/admin/appointments') ? 'active' : ''}`}>
                Lịch hẹn
              </Link>
              <div className="nav-user">
                <FiUser className="user-icon" />
                <span>Admin</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                <FiLogOut />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
