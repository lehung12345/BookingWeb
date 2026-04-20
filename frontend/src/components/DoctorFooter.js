import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMail, FiPhone, FiMapPin, FiSettings, FiExternalLink, FiBookOpen, FiShield, FiSend } from 'react-icons/fi';
import './Footer.css'; // Reusing the same styling

const DoctorFooter = () => {
  return (
    <footer className="footer" id="doctor-footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/doctor/dashboard" className="footer-logo">
              <FiHeart className="logo-icon" />
              <span>MediBook Pro</span>
            </Link>
            <p className="footer-bio">
              Cổng thông tin dành riêng cho chuyên gia y tế. Chúng tôi cung cấp các công cụ tối ưu để bác sĩ quản lý lịch trình, nâng cao hiệu quả khám chữa bệnh và kết nối với bệnh nhân một cách chuyên nghiệp.
            </p>
            <div className="footer-badges">
              <span className="badge badge-confirmed">Đối tác uy tín</span>
            </div>
          </div>

          {/* Management Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Quản lý</h4>
            <ul className="footer-links">
              <li className="footer-link-item"><Link to="/doctor/dashboard">Bảng điều khiển</Link></li>
              <li className="footer-link-item"><Link to="/doctor/schedule">Lịch làm việc</Link></li>
              <li className="footer-link-item"><Link to="/doctor/appointments">Danh sách bệnh nhân</Link></li>
              <li className="footer-link-item"><a href="#">Báo cáo thống kê</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Tài nguyên</h4>
            <ul className="footer-links">
              <li className="footer-link-item"><a href="#"><FiBookOpen /> Hướng dẫn lâm sàng</a></li>
              <li className="footer-link-item"><a href="#"><FiShield /> Quy định y tế</a></li>
              <li className="footer-link-item"><a href="#"><FiExternalLink /> Cộng đồng bác sĩ</a></li>
              <li className="footer-link-item"><a href="#">Tài liệu đào tạo</a></li>
            </ul>
          </div>

          {/* Professional Support Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Hỗ trợ kỹ thuật</h4>
            <ul className="footer-contact">
              <li className="contact-item">
                <FiMail />
                <span>provider@medibook.vn</span>
              </li>
              <li className="contact-item">
                <FiPhone />
                <span>1900 888 999 (Line bác sĩ)</span>
              </li>
              <li className="contact-item">
                <FiSettings />
                <span>Trung tâm vận hành 24/7</span>
              </li>
            </ul>
          </div>

          {/* System Updates Column */}
          <div className="footer-newsletter">
            <h4 className="footer-heading">Cập nhật hệ thống</h4>
            <p className="newsletter-text">Đăng ký để nhận thông tin về các tính năng mới và thay đổi chính sách.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email công việc" className="newsletter-input" />
              <button type="button" className="btn-newsletter" aria-label="Subscribe">
                <FiSend />
              </button>
            </form>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} MediBook for Healthcare Providers.
          </p>
          <div className="footer-bottom-links">
            <Link to="/profile" className="newsletter-text" style={{marginRight: '20px'}}>Ngôn ngữ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DoctorFooter;
