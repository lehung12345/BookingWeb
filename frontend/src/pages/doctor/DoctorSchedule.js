import React, { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';
import './DoctorSchedule.css';

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ work_date: '', start_time: '', end_time: '' });
  const [creating, setCreating] = useState(false);

  const fetchSchedules = () => {
    setLoading(true);
    scheduleService.getMySchedules()
      .then(res => setSchedules(res.data))
      .catch(() => toast.error('Lỗi tải lịch'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSchedules(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.work_date || !form.start_time || !form.end_time) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setCreating(true);
    try {
      // await scheduleService.create(form);

      const payload = {
        work_date: form.work_date, // đã đúng format yyyy-MM-dd
        start_time: form.start_time + ":00",
        end_time: form.end_time + ":00"
      };

      await scheduleService.create(payload);
      toast.success('Tạo lịch thành công');
      setForm({ work_date: '', start_time: '', end_time: '' });
      setShowForm(false);
      fetchSchedules();
    } catch (err) {
      toast.error('Lỗi tạo lịch');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa lịch này?')) return;
    try {
      await scheduleService.remove(id);
      toast.success('Đã xóa lịch');
      fetchSchedules();
    } catch (err) {
      toast.error('Lỗi xóa lịch');
    }
  };

  // Group by date
  const grouped = schedules.reduce((acc, s) => {
    if (!acc[s.work_date]) acc[s.work_date] = [];
    acc[s.work_date].push(s);
    return acc;
  }, {});

  //format 24h 
  const formatTime24h = (time) => {
    if (!time) return "";

    return new Date(`1970-01-01T${time}`).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container fade-in">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Lịch làm việc</h1>
          <p className="page-subtitle">Quản lý khung giờ khám bệnh</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} id="toggle-schedule-form">
          <FiPlus /> Thêm lịch
        </button>
      </div>

      {showForm && (
        <form className="schedule-form glass-card fade-in" onSubmit={handleCreate} id="schedule-form">
          <div className="sf-row">
            <div className="form-group">
              <label className="label"><FiCalendar /> Ngày</label>
              <input type="date" className="input-field" value={form.work_date}
                onChange={(e) => setForm({ ...form, work_date: e.target.value })} id="schedule-date" />
            </div>
            <div className="form-group">
              <label className="label"><FiClock /> Giờ bắt đầu</label>
              <input type="time" className="input-field" value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })} id="schedule-start" />
            </div>
            <div className="form-group">
              <label className="label"><FiClock /> Giờ kết thúc</label>
              <input type="time" className="input-field" value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })} id="schedule-end" />
            </div>
            <button type="submit" className="btn-primary sf-submit" disabled={creating}>
              {creating ? 'Đang tạo...' : 'Tạo'}
            </button>
          </div>
        </form>
      )}

      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state"><p>📅</p><p>Chưa có lịch nào</p></div>
      ) : (
        <div className="schedule-list">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, slots]) => (
            <div key={date} className="schedule-date-group">
              <h3 className="schedule-date-label">
                <FiCalendar /> {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </h3>
              <div className="schedule-slots">
                {slots.map(s => (
                  <div key={s.id} className={`schedule-slot glass-card ${s.is_booked ? 'booked' : ''}`} id={`schedule-${s.id}`}>
                    <span className="slot-time">
                      {/* <FiClock /> {s.start_time?.substring(0, 5)} - {s.end_time?.substring(0, 5)} */}
                      <FiClock /> {formatTime24h(s.start_time)} - {formatTime24h(s.end_time)}
                    </span>
                    <span className={`slot-status ${s.is_booked ? 'slot-booked' : 'slot-free'}`}>
                      {s.is_booked ? '🔴 Đã đóng' : '🟢 Trống'}
                    </span>
                    {!s.is_booked && (
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(s.id)}>
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
