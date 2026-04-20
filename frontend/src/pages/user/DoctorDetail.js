import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { scheduleService } from '../../services/scheduleService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiCheck } from 'react-icons/fi';
import './DoctorDetail.css';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isUser } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    Promise.all([
      doctorService.getById(id),
      scheduleService.getAvailable(id)
    ]).then(([docRes, schRes]) => {
      setDoctor(docRes.data);
      setSchedules(schRes.data);
    }).catch(() => {
      toast.error('Không thể tải thông tin bác sĩ');
    }).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để đặt lịch');
      navigate('/login');
      return;
    }
    if (!isUser) {
      toast.error('Chỉ bệnh nhân mới có thể đặt lịch');
      return;
    }
    if (!selectedSchedule) {
      toast.error('Vui lòng chọn khung giờ');
      return;
    }

    setBooking(true);
    try {
      await appointmentService.book({
        doctor_id: id,
        schedule_id: selectedSchedule,
        note: note
      });
      toast.success('Đặt lịch thành công!');
      navigate('/my-appointments');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đặt lịch thất bại');
    } finally {
      setBooking(false);
    }
  };

  // Group schedules by date
  const groupedSchedules = schedules.reduce((acc, s) => {
    const date = s.work_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(s);
    return acc;
  }, {});

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p className="loading-text">Đang tải...</p></div>;
  }

  if (!doctor) {
    return <div className="page-container"><div className="empty-state"><p>Không tìm thấy bác sĩ</p></div></div>;
  }

  return (
    <div className="page-container fade-in">
      <div className="doctor-detail-layout">
        {/* Doctor Info */}
        <div className="dd-info glass-card">
          <div className="dd-header">
            <div className="dd-avatar">
              {doctor.full_name?.charAt(0) || 'D'}
            </div>
            <div>
              <h1 className="dd-name">BS. {doctor.full_name}</h1>
              <span className="doctor-specialty-badge">{doctor.specialty_name || 'Đa khoa'}</span>
            </div>
          </div>
          <div className="dd-details">
            <div className="dd-detail-item">
              <span className="dd-label">Email:</span>
              <span>{doctor.email}</span>
            </div>
            <div className="dd-detail-item">
              <span className="dd-label">Kinh nghiệm:</span>
              <span>{doctor.experience_years || 0} năm</span>
            </div>
            {doctor.phone && (
              <div className="dd-detail-item">
                <span className="dd-label">Điện thoại:</span>
                <span>{doctor.phone}</span>
              </div>
            )}
          </div>
          {doctor.description && (
            <div className="dd-desc">
              <h3>Giới thiệu</h3>
              <p>{doctor.description}</p>
            </div>
          )}
        </div>

        {/* Booking */}
        <div className="dd-booking glass-card">
          <h2 className="dd-booking-title">
            <FiCalendar /> Đặt lịch khám
          </h2>

          {Object.keys(groupedSchedules).length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>Không có lịch trống</p>
            </div>
          ) : (
            <div className="dd-schedules">
              {Object.entries(groupedSchedules).map(([date, slots]) => (
                <div key={date} className="dd-date-group">
                  <h4 className="dd-date-label">
                    <FiCalendar /> {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </h4>
                  <div className="dd-time-slots">
                    {slots.map(s => (
                      <button
                        key={s.id}
                        className={`time-slot ${s.is_booked ? 'booked' : ''} ${selectedSchedule === s.id ? 'selected' : ''}`}
                        disabled={s.is_booked}
                        onClick={() => setSelectedSchedule(s.id)}
                        id={`slot-${s.id}`}
                      >
                        {s.is_booked ? (
                          <span>Đã đóng</span>
                        ) : selectedSchedule === s.id ? (
                          <><FiCheck /> {s.start_time?.substring(0, 5)} - {s.end_time?.substring(0, 5)}</>
                        ) : (
                          <><FiClock /> {s.start_time?.substring(0, 5)} - {s.end_time?.substring(0, 5)}</>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSchedule && (
            <div className="dd-note-section">
              <label className="label">Ghi chú</label>
              <textarea
                className="input-field"
                rows="3"
                placeholder="Mô tả triệu chứng..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                id="booking-note"
              />
            </div>
          )}

          <button
            className="btn-primary dd-book-btn"
            onClick={handleBook}
            disabled={isAuthenticated && (!selectedSchedule || booking)}
            id="confirm-booking"
          >
            {!isAuthenticated 
              ? 'Đăng nhập để đặt lịch' 
              : booking ? 'Đang đặt...' : 'Xác nhận đặt lịch'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
