import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { specialtyService } from '../../services/specialtyService';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';
import './AdminPages.css';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', phone: '',
    specialty_id: '', description: '', experience_years: 0, address: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchDoctors = () => {
    setLoading(true);
    Promise.all([doctorService.getAll(), specialtyService.getAll()])
      .then(([docRes, specRes]) => {
        setDoctors(docRes.data);
        setSpecialties(specRes.data);
      })
      .catch(() => toast.error('Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone && !/^0\d{9}$/.test(form.phone)) {
      toast.error('Số điện thoại phải là 10 chữ số và bắt đầu bằng 0');
      return;
    }
    if (!editId && !/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password)) {
      toast.error('Mật khẩu phải ít nhất 6 ký tự và chứa cả chữ và số');
      return;
    }
    setCreating(true);
    try {
      const payload = { ...form, specialty_id: form.specialty_id ? parseInt(form.specialty_id) : null };
      if (editId) {
        await adminService.updateDoctor(editId, {
          full_name: payload.full_name,
          phone: payload.phone,
          specialty_id: payload.specialty_id,
          description: payload.description,
          experience_years: payload.experience_years,
          address: payload.address
        }, avatarFile);
        toast.success('Cập nhật bác sĩ thành công');
      } else {
        if (!form.full_name?.trim() || !form.email?.trim() || !form.password?.trim()) {
          toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
          setCreating(false);
          return;
        }
        await adminService.createDoctor(payload, avatarFile);
        toast.success('Tạo bác sĩ thành công');
      }
      resetForm();
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Lỗi hệ thống');
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setForm({ full_name: '', email: '', password: '', phone: '', specialty_id: '', description: '', experience_years: 0, address: '' });
    setAvatarFile(null);
    setEditId(null);
    setShowForm(false);
  };

  const handleEditClick = (d) => {
    setForm({
      full_name: d.full_name, email: d.email, password: '', phone: d.phone,
      specialty_id: d.specialty_id || '', description: d.description || '', experience_years: d.experience_years || 0,
      address: d.address || ''
    });
    setAvatarFile(null); // Reset avatar file for edit
    setEditId(d.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa bác sĩ này?')) return;
    try {
      await adminService.deleteDoctor(id);
      toast.success('Đã xóa');
      fetchDoctors();
    } catch { toast.error('Lỗi xóa'); }
  };

  const filtered = doctors.filter(d =>
    d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container fade-in">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Quản lý bác sĩ</h1>
          <p className="page-subtitle">Thêm, sửa, xóa bác sĩ trong hệ thống</p>
        </div>
        <button className="btn-primary" onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} id="toggle-doctor-form">
          {showForm ? 'Đóng' : <><FiPlus /> Thêm bác sĩ</>}
        </button>
      </div>

      {showForm && (
        <form className="glass-card fade-in" style={{ padding: '24px', marginBottom: '24px' }} onSubmit={handleSubmit} id="create-doctor-form">
<h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>{editId ? `Cập nhật thông tin: Bác sĩ ${form.full_name || '...'}` : 'Tạo bác sĩ mới'}</h3>
          <div className="admin-form-row">
              {(editId ? (
                <>
                  <div className="form-group">
                    <label className="label">Họ tên *</label>
                    <input className="input-field" placeholder="Nhập họ tên" value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Email</label>
                    <input className="input-field" type="email" value={form.email} readOnly
                      style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  </div>
                  <div className="form-group">
                    <label className="label">SĐT</label>
                    <input className="input-field" type="tel" inputMode="tel" maxLength="10" placeholder="Nhập 10 chữ số, bắt đầu bằng 0" value={form.phone || ''}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} />
                  </div>
                  {/* <div className="form-group">
                    <label className="label">Địa chỉ</label>
                    <input className="input-field" placeholder="Nhập địa chỉ" value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div> */}
                </>
              ) : (
              <>
                <div className="form-group">
                  <label className="label">Họ tên *</label>
                  <input className="input-field" placeholder="Nhập họ tên" value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="label">Email *</label>
                  <input className="input-field" type="email" placeholder="Nhập email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="label">Mật khẩu *</label>
                  <input className="input-field" type="password" placeholder="Ít nhất 6 ký tự, chứa chữ và số" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength="6" />
                </div>
                <div className="form-group">
                  <label className="label">SĐT</label>
                  <input className="input-field" type="tel" inputMode="tel" maxLength="10" placeholder="Nhập 10 chữ số, bắt đầu bằng 0" value={form.phone || ''}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} />
                </div>
              </>
            ))}
            <div className="form-group">
              <label className="label">Chuyên khoa</label>
              <select className="input-field" value={form.specialty_id}
                onChange={(e) => setForm({ ...form, specialty_id: e.target.value })}>
                <option value="">Chọn chuyên khoa</option>
                {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Năm kinh nghiệm</label>
              <input className="input-field" type="number" min="0" value={form.experience_years}
                onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="label">Địa chỉ</label>
              <input className="input-field" placeholder="Nhập địa chỉ" value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Ảnh đại diện</label>
              <input className="input-field" type="file" accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="label">Mô tả</label>
            <textarea className="input-field" rows="3" placeholder="Mô tả bác sĩ..." value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '16px' }} disabled={creating}>
            {creating ? 'Đang lưu...' : (editId ? 'Lưu thay đổi' : 'Tạo bác sĩ')}
          </button>
        </form>
      )}

      <div className="search-box" style={{ marginBottom: '20px' }}>
        <FiSearch className="search-icon" />
        <input type="text" className="input-field" placeholder="Tìm kiếm..." value={search}
          onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} id="doctor-search-admin" />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Bác sĩ</th>
              <th>Email</th>
              <th>Chuyên khoa</th>
              <th>Kinh nghiệm</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td><strong>BS. {d.full_name}</strong></td>
                <td>{d.email}</td>
                <td><span className="badge badge-confirmed">{d.specialty_name || 'N/A'}</span></td>
                <td>{d.experience_years || 0} năm</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn-secondary btn-sm" onClick={() => handleEditClick(d)}>
                      Sửa
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(d.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDoctors;
