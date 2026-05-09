import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { doctorService } from '../../services/doctorService';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiLock, FiCalendar, FiEdit2, FiMapPin } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user, isDoctor, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    address: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        full_name: user.full_name || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (doctorDetails) {
      setProfileForm(prev => ({
        ...prev,
        address: doctorDetails.address || ''
      }));
      setPreviewAvatar(doctorDetails.avatar_url || null);
    }
  }, [doctorDetails]);

  useEffect(() => {
    const loadDoctorDetails = async () => {
      if (!user || !isDoctor) return;
      setDoctorLoading(true);
      try {
        const res = await doctorService.getMe();
        setDoctorDetails(res.data);
      } catch (err) {
        console.error('Không lấy được thông tin bác sĩ:', err);
      } finally {
        setDoctorLoading(false);
      }
    };

    loadDoctorDetails();
  }, [user, isDoctor]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.full_name) {
      toast.error('Họ tên không được để trống');
      return;
    }
    if (profileForm.phone && !/^0\d{9}$/.test(profileForm.phone)) {
      toast.error('Số điện thoại phải là 10 chữ số và bắt đầu bằng 0');
      return;
    }

    setLoading(true);
    try {
      if (isDoctor) {
        const formData = new FormData();
        formData.append('full_name', profileForm.full_name);
        formData.append('phone', profileForm.phone || '');
        formData.append('address', profileForm.address || '');
        if (avatarFile) {
          formData.append('avatar', avatarFile);
        }
        await doctorService.updateProfile(formData);
      } else {
        await authService.updateProfile({
          full_name: profileForm.full_name,
          phone: profileForm.phone
        });
      }

      const updatedUser = { ...user, full_name: profileForm.full_name, phone: profileForm.phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Cập nhật thông tin thành công');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Lỗi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.current_password || !passwordForm.new_password) {
      toast.error('Vui lòng điền đầy đủ thông tin mật khẩu');
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Mật khẩu xác nhận không khớp. Vui lòng nhập lại cho đúng.');
      // Clear confirmation field to force re-entry
      setPasswordForm(prev => ({ ...prev, confirm_password: '' }));
      return;
    }
    if (passwordForm.new_password.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      toast.success('Đổi mật khẩu thành công');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Lỗi đổi mật khẩu';
      toast.error(errorMsg);
      // If current password is wrong, clear it to force "nhập lại cho đúng"
      if (errorMsg.includes('Mật khẩu hiện tại')) {
        setPasswordForm(prev => ({ ...prev, current_password: '' }));
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="profile-container fade-in">
      <div className="profile-layout">
        
        {/* Column 1: Info Sidebar */}
        <div className="profile-sidebar glass-card profile-section">
          <div className="profile-avatar-large">
            {previewAvatar ? (
              <img src={previewAvatar} alt="Avatar bác sĩ" className="profile-avatar-img" />
            ) : (
              user.full_name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <h2 className="profile-name-sidebar">{user.full_name}</h2>
          <span className="profile-role-badge">
            {isDoctor ? 'Tài khoản Bác sĩ' : isAdmin ? 'Tài khoản Admin' : 'Tài khoản Bệnh nhân'}
          </span>
          
          <div className="profile-info-list">
            <div className="info-item">
              <FiMail /> <span>{user.email}</span>
            </div>
            <div className="info-item">
              <FiPhone /> <span>{user.phone || 'Chưa cập nhật'}</span>
            </div>
            {isDoctor && (
              <>
                <div className="info-item">
                  <FiUser /> <span>{doctorLoading ? 'Đang tải chuyên khoa...' : doctorDetails?.specialty_name || 'Chưa có chuyên khoa'}</span>
                </div>
                <div className="info-item">
                  <FiCalendar /> <span>{doctorLoading ? 'Đang tải...' : `${doctorDetails?.experience_years ?? 0} năm kinh nghiệm`}</span>
                </div>
                <div className="info-item">
                  <FiMapPin /> <span>{doctorLoading ? 'Đang tải địa chỉ...' : doctorDetails?.address || 'Chưa cập nhật địa chỉ'}</span>
                </div>
              </>
            )}
            <div className="info-item">
              <FiCalendar /> <span>Tham gia: {new Date(user.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Edit Profile */}
        <section className="profile-section glass-card">
          <h3 className="section-title">
            <FiEdit2 /> Chỉnh sửa thông tin
          </h3>
          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="label">Họ và tên</label>
              <input 
                type="text" 
                className="input-field" 
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                placeholder="Nhập họ tên của bạn"
              />
            </div>
            <div className="form-group">
              <label className="label">Số điện thoại</label>
              <input 
                type="tel" 
                inputMode="tel"
                maxLength="10"
                className="input-field" 
                value={profileForm.phone}
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value.replace(/\D/g, '')})}
                placeholder="Nhập 10 chữ số, bắt đầu bằng 0"
              />
            </div>
            {isDoctor && (
              <>
                <div className="form-group">
                  <label className="label">Địa chỉ nhà cá nhân</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                    placeholder="Nhập địa chỉ nhà cá nhân"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Đổi ảnh đại diện</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="input-field"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setAvatarFile(file);
                      if (file) {
                        setPreviewAvatar(URL.createObjectURL(file));
                      } else {
                        setPreviewAvatar(doctorDetails?.avatar_url || null);
                      }
                    }}
                  />
                </div>
              </>
            )}
            <button type="submit" className="btn-primary btn-profile-save" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </section>

        {/* Column 3: Change Password */}
        <section className="profile-section glass-card password-section">
          <h3 className="section-title">
            <FiLock /> Đổi mật khẩu
          </h3>
          <form className="profile-form" onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="label">Mật khẩu hiện tại</label>
              <input 
                type="password" 
                className="input-field" 
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label className="label">Mật khẩu mới</label>
              <input 
                type="password" 
                className="input-field" 
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
            <div className="form-group">
              <label className="label">Xác nhận mật khẩu</label>
              <input 
                type="password" 
                className="input-field" 
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <button type="submit" className="btn-primary btn-profile-save" style={{ background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)' }} disabled={passwordLoading}>
              {passwordLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </section>

      </div>
    </div>
  );
};

export default Profile;
