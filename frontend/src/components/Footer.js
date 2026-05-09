import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiYoutube, FiTwitter, FiSend } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <FiHeart className="logo-icon" />
              <span>MediBook</span>
            </Link>
            <p className="footer-bio">
              Nền tảng đặt lịch khám số 1 Việt Nam. Chúng tôi kết nối hàng triệu bệnh nhân với hàng ngàn bác sĩ uy tín trên toàn quốc, mang lại trải nghiệm chăm sóc sức khỏe hiện đại và dễ dàng.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com" className="social-icon" aria-label="Facebook"><FiFacebook /></a>
              <a href="https://www.instagram.com" className="social-icon" aria-label="Instagram"><FiInstagram /></a>
              <a href="https://www.youtube.com" className="social-icon" aria-label="Youtube"><FiYoutube /></a>
              <a href="https://www.twitter.com" className="social-icon" aria-label="Twitter"><FiTwitter /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Khám phá</h4>
            <ul className="footer-links">
              <li className="footer-link-item"><Link to="/">Trang chủ</Link></li>
              <li className="footer-link-item"><Link to="/doctors">Danh sách bác sĩ</Link></li>
              <li className="footer-link-item"><a href="/specialties">Chuyên khoa</a></li>
              <li className="footer-link-item"><a href="/facilities">Cơ sở y tế</a></li>
              <li className="footer-link-item"><a href="/clinics">Phòng khám</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Hỗ trợ</h4>
            <ul className="footer-links">
              <li className="footer-link-item"><a href="/faq">Câu hỏi thường gặp</a></li>
              <li className="footer-link-item"><a href="/privacy">Chính sách bảo mật</a></li>
              <li className="footer-link-item"><a href="/terms">Điều khoản sử dụng</a></li>
              <li className="footer-link-item"><a href="/booking-process">Quy trình đặt lịch</a></li>
              <li className="footer-link-item"><a href="/support">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Liên hệ</h4>
            <ul className="footer-contact">
              <li className="contact-item">
                <FiMapPin />
                <span>Hoàng Quốc Việt, Cầu Giấy, Hà Nội</span>
              </li>
              <li className="contact-item">
                <FiPhone />
                <span>0123 456 789</span>
              </li>
              <li className="contact-item">
                <FiMail />
                <span>hotro@medibook.vn</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer-newsletter">
            <h4 className="footer-heading">Bản tin</h4>
            <p className="newsletter-text">Đăng ký để nhận thông báo về sức khỏe và các khuyến mãi mới nhất.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email của bạn" className="newsletter-input" />
              <button type="button" className="btn-newsletter" aria-label="Send">
                <FiSend />
              </button>
            </form>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} MediBook Vietnam. All Rights Reserved.
          </p>
          {/* <div className="footer-bottom-links">
            <span className="newsletter-text" style={{marginRight: '15px'}}>Ngôn ngữ: Tiếng Việt</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
