import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiHeart, FiUser, FiPhone } from 'react-icons/fi';
import './Login.css';

const Register = () => {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Họ tên không được để trống';
    if (!form.email.trim()) errs.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ';
    if (!form.password.trim()) errs.password = 'Mật khẩu không được để trống';
    else if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password)) errs.password = 'Mật khẩu phải ít nhất 6 ký tự và chứa cả chữ và số';
    if (form.phone && !/^0\d{9}$/.test(form.phone)) errs.phone = 'Số điện thoại phải là 10 chữ số và bắt đầu bằng 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await authService.register(form);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || 'Đăng ký thất bại';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="auth-card fade-in" id="register-card">
        <div className="auth-header">
          <div className="auth-logo">
            <FiHeart />
          </div>
          <h1 className="auth-title">Đăng ký</h1>
          <p className="auth-subtitle">Tạo tài khoản MediBook mới</p>
        </div>

        {apiError && <div className="api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="form-group">
            <label className="label">Họ và tên</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                className={`input-field input-with-icon ${errors.full_name ? 'input-error' : ''}`}
                placeholder="Nhập họ và tên"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                id="register-name"
              />
            </div>
            {errors.full_name && <span className="error-text">{errors.full_name}</span>}
          </div>

          <div className="form-group">
            <label className="label">Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                className={`input-field input-with-icon ${errors.email ? 'input-error' : ''}`}
                placeholder="Nhập email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                id="register-email"
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="label">Mật khẩu</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                className={`input-field input-with-icon ${errors.password ? 'input-error' : ''}`}
                placeholder="Ít nhất 6 ký tự, chứa chữ và số"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                id="register-password"
              />
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="label">Số điện thoại (tuỳ chọn)</label>
            <div className="input-wrapper">
              <FiPhone className="input-icon" />
              <input
                type="tel"
                inputMode="tel"
                maxLength="10"
                className={`input-field input-with-icon ${errors.phone ? 'input-error' : ''}`}
                placeholder="Nhập 10 chữ số, bắt đầu bằng 0"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                id="register-phone"
              />
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading} id="register-submit">
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : 'Đăng ký'}
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản?{' '}
          <Link to="/login" className="auth-link">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
