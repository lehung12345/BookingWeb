import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiCheckCircle, FiCalendar, FiClock } from 'react-icons/fi';
import './DoctorAppointments.css';

const statusLabels = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [noteModal, setNoteModal] = useState(null);
  const [noteText, setNoteText] = useState('');

  const fetch = () => {
    setLoading(true);
    appointmentService.getDoctorAppointments()
      .then(res => setAppointments(res.data))
      .catch(() => toast.error('Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status, note = null) => {
    try {
      await appointmentService.updateStatus(id, { status, note });
      toast.success('Cập nhật thành công');
      fetch();
      setNoteModal(null);
    } catch (err) {
      toast.error('Lỗi cập nhật');
    }
  };

  const handleComplete = (id) => {
    setNoteModal(id);
    setNoteText('');
  };

  const submitComplete = () => {
    updateStatus(noteModal, 'COMPLETED', noteText || null);
  };

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Quản lý lịch hẹn</h1>
      <p className="page-subtitle">Xem và quản lý bệnh nhân đã đặt lịch</p>

      <div className="appt-filters">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? `Tất cả (${appointments.length})` : `${statusLabels[f]} (${appointments.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><p>📋</p><p>Không có lịch hẹn</p></div>
      ) : (
        <div className="da-list">
          {filtered.map(a => (
            <div key={a.id} className="da-card glass-card" id={`da-${a.id}`}>
              <div className="da-patient">
                <div className="da-patient-avatar">{a.patient_name?.charAt(0) || 'P'}</div>
                <div>
                  <h3>{a.patient_name}</h3>
                  <p>{a.patient_email}</p>
                  {a.patient_phone && <p>📱 {a.patient_phone}</p>}
                </div>
              </div>

              <div className="da-schedule">
                <span><FiCalendar /> {a.work_date ? new Date(a.work_date).toLocaleDateString('vi-VN') : ''}</span>
                <span><FiClock /> {a.start_time?.substring(0, 5)} - {a.end_time?.substring(0, 5)}</span>
              </div>

              <div className="da-status">
                <span className={`badge ${a.status === 'PENDING' ? 'badge-pending' : a.status === 'CONFIRMED' ? 'badge-confirmed' : a.status === 'COMPLETED' ? 'badge-completed' : 'badge-cancelled'}`}>
                  {statusLabels[a.status]}
                </span>
                {a.note && <p className="da-note">📝 {a.note}</p>}
              </div>

              <div className="da-actions">
                {a.status === 'PENDING' && (
                  <>
                    <button className="btn-success btn-sm" onClick={() => updateStatus(a.id, 'CONFIRMED')}>
                      <FiCheck /> Xác nhận
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => updateStatus(a.id, 'CANCELLED')}>
                      <FiX /> Từ chối
                    </button>
                  </>
                )}
                {a.status === 'CONFIRMED' && (
                  <button className="btn-primary btn-sm" onClick={() => handleComplete(a.id)}>
                    <FiCheckCircle /> Hoàn thành
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      {noteModal && (
        <div className="modal-overlay" onClick={() => setNoteModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Ghi chú chẩn đoán</h3>
            <div className="form-group">
              <label className="label">Chẩn đoán / Ghi chú (tuỳ chọn)</label>
              <textarea
                className="input-field"
                rows="4"
                placeholder="Nhập chẩn đoán..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                id="diagnosis-note"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn-primary" onClick={submitComplete} style={{ flex: 1 }}>
                <FiCheckCircle /> Xác nhận hoàn thành
              </button>
              <button className="btn-secondary" onClick={() => setNoteModal(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
