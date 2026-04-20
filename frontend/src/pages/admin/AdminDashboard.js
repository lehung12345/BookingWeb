import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { FiUsers, FiUserCheck, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiActivity } from 'react-icons/fi';
import '../doctor/DoctorDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Tổng quan hệ thống MediBook</p>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #00d4ff)' }}><FiUsers /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.total_users || 0}</span>
            <span className="stat-name">Bệnh nhân</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #f43f5e)' }}><FiUserCheck /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.total_doctors || 0}</span>
            <span className="stat-name">Bác sĩ</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #00d4ff)' }}><FiCalendar /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.total_appointments || 0}</span>
            <span className="stat-name">Tổng lịch hẹn</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}><FiActivity /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.today_appointments || 0}</span>
            <span className="stat-name">Hôm nay</span>
          </div>
        </div>
      </div>

      <h2 className="section-sub-title" style={{ marginTop: '20px' }}>📊 Thống kê trạng thái</h2>
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}><FiClock /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.pending_appointments || 0}</span>
            <span className="stat-name">Chờ xác nhận</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}><FiCalendar /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.confirmed_appointments || 0}</span>
            <span className="stat-name">Đã xác nhận</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}><FiCheckCircle /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.completed_appointments || 0}</span>
            <span className="stat-name">Hoàn thành</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)' }}><FiXCircle /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.cancelled_appointments || 0}</span>
            <span className="stat-name">Đã hủy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
