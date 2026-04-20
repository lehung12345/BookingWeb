import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import './AdminLogin.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'ADMIN' });
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
      
      if (res.data.user.role !== 'ADMIN') {
        setApiError('Tài khoản này không có quyền quản trị viên.');
        toast.error('Tài khoản này không có quyền quản trị viên.');
        setLoading(false);
        return;
      }

      login(res.data.token, res.data.user);
      toast.success('Đăng nhập thành công!');
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Sai tài khoản hoặc mật khẩu';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-bg-shapes">
        <div className="admin-shape admin-shape-1"></div>
        <div className="admin-shape admin-shape-2"></div>
      </div>

      <div className="admin-auth-card fade-in">
        <div className="admin-auth-header">
          <div className="admin-auth-logo">
            <FiShield />
          </div>
          <h1 className="admin-auth-title">Quản Trị Viên</h1>
          <p className="admin-auth-subtitle">MediBook Admin Portal</p>
        </div>

        {apiError && <div className="admin-api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} className="admin-auth-form">
          <div className="admin-form-group">
            <label className="admin-label">Email Quản Trị</label>
            <div className="admin-input-wrapper">
              <FiMail className="admin-input-icon" />
              <input
                type="email"
                className={`admin-input-field admin-input-with-icon ${errors.email ? 'admin-input-error' : ''}`}
                placeholder="admin@medibook.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {errors.email && <span className="admin-error-text">{errors.email}</span>}
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Mật Khẩu</label>
            <div className="admin-input-wrapper">
              <FiLock className="admin-input-icon" />
              <input
                type="password"
                className={`admin-input-field admin-input-with-icon ${errors.password ? 'admin-input-error' : ''}`}
                placeholder="Nhập mật khẩu..."
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {errors.password && <span className="admin-error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="admin-btn-primary admin-auth-submit" disabled={loading}>
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: '0 auto' }}></div> : 'Đăng nhập hệ thống'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
