import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiSearch } from 'react-icons/fi';
import './AdminPages.css';

const statusLabels = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SCHEDULED: 'Đã lên lịch',
  PATIENT_CONFIRMED: 'Bệnh nhân đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchAppointments = () => {
    setLoading(true);
    adminService.getAllAppointments()
      .then(res => setAppointments(res.data))
      .catch(() => toast.error('Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);



  const filtered = appointments
    .filter(a => filter === 'ALL' || a.status === filter)
    .filter(a =>
      a.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor_name?.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Quản lý lịch hẹn</h1>
      <p className="page-subtitle">Xem toàn bộ lịch hẹn trong hệ thống</p>

      <div className="search-box" style={{ marginBottom: '16px' }}>
        <FiSearch className="search-icon" />
        <input type="text" className="input-field" placeholder="Tìm theo tên bệnh nhân, bác sĩ..."
          value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} id="appt-search" />
      </div>

      <div className="appt-filters" style={{ marginBottom: '20px' }}>
        {['ALL', 'PENDING', 'CONFIRMED', 'SCHEDULED', 'PATIENT_CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? `Tất cả (${appointments.length})` : `${statusLabels[f]} (${appointments.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Bệnh nhân</th>
              <th>Bác sĩ</th>
              <th>Chuyên khoa</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td><strong>{a.patient_name}</strong></td>
                <td>BS. {a.doctor_name}</td>
                <td>{a.specialty_name || '—'}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCalendar /> {a.work_date ? new Date(a.work_date).toLocaleDateString('vi-VN') : '—'}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock /> {a.start_time?.substring(0, 5)} - {a.end_time?.substring(0, 5)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${a.status === 'PENDING' ? 'badge-pending' : (a.status === 'CONFIRMED' || a.status === 'SCHEDULED' || a.status === 'PATIENT_CONFIRMED') ? 'badge-confirmed' : a.status === 'COMPLETED' ? 'badge-completed' : 'badge-cancelled'}`}>
                    {statusLabels[a.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointments;
