import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { FiUsers, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      doctorService.getMe(),
      appointmentService.getDoctorAppointments()
    ]).then(([docRes, apptRes]) => {
      setDoctor(docRes.data);
      setAppointments(apptRes.data);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.work_date === today);
  const pending = appointments.filter(a => a.status === 'PENDING').length;
  const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const totalPatients = new Set(appointments.map(a => a.user_id)).size;

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p className="loading-text">Đang tải...</p></div>;
  }

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Dashboard Bác sĩ</h1>
      <p className="page-subtitle">Xin chào, BS. {doctor?.full_name} 👋</p>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #00d4ff)' }}><FiUsers /></div>
          <div className="stat-content">
            <span className="stat-value">{totalPatients}</span>
            <span className="stat-name">Tổng bệnh nhân</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}><FiClock /></div>
          <div className="stat-content">
            <span className="stat-value">{pending}</span>
            <span className="stat-name">Chờ xác nhận</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}><FiCalendar /></div>
          <div className="stat-content">
            <span className="stat-value">{confirmed}</span>
            <span className="stat-name">Đã xác nhận</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #00d4ff)' }}><FiCheckCircle /></div>
          <div className="stat-content">
            <span className="stat-value">{completed}</span>
            <span className="stat-name">Hoàn thành</span>
          </div>
        </div>
      </div>

      {/* Today's appointments */}
      <div className="today-section">
        <h2 className="section-sub-title">📅 Lịch hẹn hôm nay ({todayAppts.length})</h2>
        {todayAppts.length === 0 ? (
          <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Không có lịch hẹn hôm nay
          </div>
        ) : (
          <div className="today-list">
            {todayAppts.map(a => (
              <div key={a.id} className="today-card glass-card">
                <div className="today-time">
                  {a.start_time?.substring(0, 5)} - {a.end_time?.substring(0, 5)}
                </div>
                <div className="today-info">
                  <h4>{a.patient_name}</h4>
                  <p>{a.patient_email}</p>
                </div>
                <span className={`badge ${a.status === 'PENDING' ? 'badge-pending' : a.status === 'CONFIRMED' ? 'badge-confirmed' : a.status === 'COMPLETED' ? 'badge-completed' : 'badge-cancelled'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
