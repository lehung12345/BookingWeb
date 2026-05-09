import React, { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';
import './DoctorSchedule.css';

// Helper: parse "HH:MM" -> { h, m }
const parseHM = (val) => {
  if (!val) return { h: '', m: '' };
  const [h, m] = val.split(':');
  return { h: h || '', m: m || '' };
};

// Helper: build "HH:MM" from h, m strings
const buildHM = (h, m) => {
  if (h === '' && m === '') return '';
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ work_date: '', start_time: '', end_time: '' });
  const [creating, setCreating] = useState(false);

  // Helper: format date to YYYY-MM-DD
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

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
    // Validate: only allow today and tomorrow
    if (form.work_date !== todayStr && form.work_date !== tomorrowStr) {
      toast.error('Chỉ được tạo lịch cho hôm nay và ngày mai');
      return;
    }
    // Validate: only one schedule per day
    if (schedules.some(s => s.work_date === form.work_date)) {
      toast.error('Ngày này đã có lịch rồi, chỉ được tạo một lịch cho mỗi ngày');
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
              <input 
                type="date" 
                className="input-field" 
                value={form.work_date}
                min={todayStr}
                max={tomorrowStr}
                onChange={(e) => setForm({ ...form, work_date: e.target.value })} 
                id="schedule-date" 
              />
            </div>
            <div className="form-group">
              <label className="label"><FiClock /> Giờ bắt đầu</label>
              <div className="time-picker-24h">
                <input
                  type="number" min="0" max="23" placeholder="HH"
                  className="time-part-input"
                  id="schedule-start-h"
                  value={parseHM(form.start_time).h}
                  onChange={(e) => {
                    const h = Math.max(0, Math.min(23, Number(e.target.value)));
                    setForm({ ...form, start_time: buildHM(h, parseHM(form.start_time).m) });
                  }}
                />
                <span className="time-sep">:</span>
                <input
                  type="number" min="0" max="59" placeholder="MM"
                  className="time-part-input"
                  id="schedule-start-m"
                  value={parseHM(form.start_time).m}
                  onChange={(e) => {
                    const m = Math.max(0, Math.min(59, Number(e.target.value)));
                    setForm({ ...form, start_time: buildHM(parseHM(form.start_time).h, m) });
                  }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="label"><FiClock /> Giờ kết thúc</label>
              <div className="time-picker-24h">
                <input
                  type="number" min="0" max="23" placeholder="HH"
                  className="time-part-input"
                  id="schedule-end-h"
                  value={parseHM(form.end_time).h}
                  onChange={(e) => {
                    const h = Math.max(0, Math.min(23, Number(e.target.value)));
                    setForm({ ...form, end_time: buildHM(h, parseHM(form.end_time).m) });
                  }}
                />
                <span className="time-sep">:</span>
                <input
                  type="number" min="0" max="59" placeholder="MM"
                  className="time-part-input"
                  id="schedule-end-m"
                  value={parseHM(form.end_time).m}
                  onChange={(e) => {
                    const m = Math.max(0, Math.min(59, Number(e.target.value)));
                    setForm({ ...form, end_time: buildHM(parseHM(form.end_time).h, m) });
                  }}
                />
              </div>
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
                      <FiClock /> {s.start_time?.substring(0,5)} - {s.end_time?.substring(0,5)}
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
