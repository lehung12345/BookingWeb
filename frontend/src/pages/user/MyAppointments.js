import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiX } from 'react-icons/fi';
import './MyAppointments.css';

const statusMap = {
  PENDING: { label: 'Chờ xác nhận', class: 'badge-pending' },
  CONFIRMED: { label: 'Đã xác nhận', class: 'badge-confirmed' },
  COMPLETED: { label: 'Hoàn thành', class: 'badge-completed' },
  CANCELLED: { label: 'Đã hủy', class: 'badge-cancelled' },
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchAppointments = () => {
    setLoading(true);
    appointmentService.getMyAppointments()
      .then(res => setAppointments(res.data))
      .catch(() => toast.error('Lỗi tải lịch hẹn'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return;
    try {
      await appointmentService.cancel(id);
      toast.success('Hủy lịch thành công');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Lỗi hủy lịch');
    }
  };

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p className="loading-text">Đang tải...</p></div>;
  }

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Lịch hẹn của tôi</h1>
      <p className="page-subtitle">Quản lý các lịch hẹn khám bệnh</p>

      <div className="appt-filters">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'ALL' ? 'Tất cả' : statusMap[f]?.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>📋</p>
          <p>Chưa có lịch hẹn nào</p>
        </div>
      ) : (
        <div className="appt-list">
          {filtered.map(a => (
            <div key={a.id} className="appt-card glass-card" id={`appt-${a.id}`}>
              <div className="appt-left">
                <div className="appt-avatar">{a.doctor_name?.charAt(0) || 'D'}</div>
              </div>
              <div className="appt-center">
                <h3>BS. {a.doctor_name}</h3>
                <span className="dc-specialty">{a.specialty_name || 'Đa khoa'}</span>
                <div className="appt-meta">
                  <span><FiCalendar /> {a.work_date ? new Date(a.work_date).toLocaleDateString('vi-VN') : ''}</span>
                  <span><FiClock /> {a.start_time?.substring(0, 5)} - {a.end_time?.substring(0, 5)}</span>
                </div>
                {a.note && <p className="appt-note">📝 {a.note}</p>}
              </div>
              <div className="appt-right">
                <span className={`badge ${statusMap[a.status]?.class}`}>
                  {statusMap[a.status]?.label}
                </span>
                {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                  <button
                    className="btn-danger btn-sm"
                    onClick={() => handleCancel(a.id)}
                    id={`cancel-${a.id}`}
                  >
                    <FiX /> Hủy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
