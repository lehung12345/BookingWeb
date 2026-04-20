import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { specialtyService } from '../../services/specialtyService';
import { doctorService } from '../../services/doctorService';
import { FiHeart, FiCalendar, FiShield, FiArrowRight, FiStar, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    specialtyService.getAll().then(res => setSpecialties(res.data)).catch(() => {});
    doctorService.getAll().then(res => setDoctors(res.data.slice(0, 4))).catch(() => {});
  }, []);

  const specialtyIcons = {
    'Cardiology': '❤️', 'Dermatology': '🧴', 'Dental': '🦷', 'Neurology': '🧠',
    'Pediatrics': '👶', 'Orthopedics': '🦴', 'Ophthalmology': '👁️', 'ENT': '👂'
  };

  return (
    <div className="home-page fade-in">
      {/* Hero */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <FiShield /> Nền tảng đặt lịch khám số 1 Việt Nam
          </div>
          <h1 className="hero-title">
            Chăm sóc sức khỏe<br />
            <span className="gradient-text">Dễ dàng & Nhanh chóng</span>
          </h1>
          <p className="hero-description">
            Đặt lịch khám với bác sĩ chuyên khoa hàng đầu chỉ trong vài bước đơn giản.
            An toàn, tiện lợi, và hoàn toàn miễn phí.
          </p>
          <div className="hero-actions">
            <Link to="/doctors" className="btn-primary btn-lg">
              Đặt lịch ngay <FiArrowRight />
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn-secondary btn-lg">
                Tạo tài khoản
              </Link>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Bác sĩ</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">10+</span>
              <span className="stat-label">Chuyên khoa</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Bệnh nhân</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="page-container">
          <h2 className="section-title">Tại sao chọn <span className="gradient-text">MediBook</span>?</h2>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #00d4ff, #3b82f6)' }}>
                <FiCalendar />
              </div>
              <h3>Đặt lịch dễ dàng</h3>
              <p>Chọn bác sĩ, chọn giờ, xác nhận. Chỉ 3 bước đơn giản.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #f43f5e)' }}>
                <FiUsers />
              </div>
              <h3>Bác sĩ chuyên khoa</h3>
              <p>Đội ngũ bác sĩ giàu kinh nghiệm từ các chuyên khoa hàng đầu.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10b981, #00d4ff)' }}>
                <FiShield />
              </div>
              <h3>An toàn & Bảo mật</h3>
              <p>Thông tin cá nhân được bảo mật tuyệt đối với chuẩn bảo mật cao.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}>
                <FiStar />
              </div>
              <h3>Đánh giá chất lượng</h3>
              <p>Hệ thống đánh giá minh bạch giúp bạn lựa chọn bác sĩ phù hợp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      {specialties.length > 0 && (
        <section className="specialties-section">
          <div className="page-container">
            <h2 className="section-title">Chuyên khoa <span className="gradient-text">nổi bật</span></h2>
            <div className="specialties-grid">
              {specialties.map(s => (
                <Link to={`/doctors?specialty=${s.id}`} key={s.id} className="specialty-card glass-card">
                  <span className="specialty-icon">{specialtyIcons[s.name] || '🏥'}</span>
                  <h3>{s.name}</h3>
                  <p>{s.doctor_count} bác sĩ</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Doctors */}
      {doctors.length > 0 && (
        <section className="doctors-preview-section">
          <div className="page-container">
            <div className="section-header">
              <h2 className="section-title">Bác sĩ <span className="gradient-text">nổi bật</span></h2>
              <Link to="/doctors" className="view-all-link">Xem tất cả <FiArrowRight /></Link>
            </div>
            <div className="doctors-preview-grid">
              {doctors.map(d => (
                <Link to={`/doctor/${d.id}`} key={d.id} className="doctor-preview-card glass-card">
                  <div className="doctor-avatar">
                    {d.full_name?.charAt(0) || 'D'}
                  </div>
                  <h3>BS. {d.full_name}</h3>
                  <span className="doctor-specialty-badge">
                    {d.specialty_name || 'Đa khoa'}
                  </span>
                  <p className="doctor-exp">{d.experience_years || 0} năm kinh nghiệm</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="page-container">
            <div className="cta-card">
              <h2>Bắt đầu đặt lịch khám ngay hôm nay</h2>
              <p>Tham gia cùng hàng nghìn bệnh nhân đã tin tưởng MediBook</p>
              <Link to="/register" className="btn-primary btn-lg">
                <FiHeart /> Đăng ký miễn phí để nhận tư vấn từ những bác sĩ hàng đầu
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
