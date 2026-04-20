import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiHeart, FiUser, FiUserCheck } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'USER' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ';
    if (!form.password.trim()) errs.password = 'Mật khẩu không được để trống';
    else if (form.password.length < 6) errs.password = 'Mật khẩu ít nhất 6 ký tự';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.data.token, res.data.user);
      toast.success('Đăng nhập thành công!');

      const role = res.data.user.role;
      if (role === 'USER') navigate('/');
      else if (role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Sai tài khoản hoặc mật khẩu';
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

      <div className="auth-card fade-in" id="login-card">
        <div className="auth-header">
          <div className="auth-logo">
            <FiHeart />
          </div>
          <h1 className="auth-title">Đăng nhập</h1>
          <p className="auth-subtitle">Chào mừng bạn trở lại MediBook</p>
        </div>

        {/* Role Toggle */}
        <div className="role-toggle" id="role-toggle">
          <button
            type="button"
            className={`role-btn ${form.role === 'USER' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, role: 'USER' })}
            id="role-user-btn"
          >
            <FiUser /> Bệnh nhân
          </button>
          <button
            type="button"
            className={`role-btn ${form.role === 'DOCTOR' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, role: 'DOCTOR' })}
            id="role-doctor-btn"
          >
            <FiUserCheck /> Bác sĩ
          </button>
        </div>

        {apiError && <div className="api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="form-group">
            <label className="label">Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                className={`input-field input-with-icon ${errors.email ? 'input-error' : ''}`}
                placeholder="Nhập email của bạn"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                id="login-email"
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
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                id="login-password"
              />
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading} id="login-submit">
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : 'Đăng nhập'}
          </button>
        </form>

        <p className="auth-footer">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="auth-link">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
