import React, { useState, useEffect } from 'react';
import { specialtyService } from '../../services/specialtyService';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import './AdminPages.css';

const AdminSpecialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchSpecialties = () => {
    setLoading(true);
    specialtyService.getAll()
      .then(res => setSpecialties(res.data))
      .catch(() => toast.error('Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSpecialties(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) { toast.error('Tên không được để trống'); return; }
    setCreating(true);
    try {
      await specialtyService.create({ name: newName });
      toast.success('Tạo thành công');
      setNewName('');
      fetchSpecialties();
    } catch { toast.error('Lỗi tạo'); }
    finally { setCreating(false); }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) { toast.error('Tên không được để trống'); return; }
    try {
      await specialtyService.update(id, { name: editName });
      toast.success('Cập nhật thành công');
      setEditId(null);
      fetchSpecialties();
    } catch { toast.error('Lỗi cập nhật'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa chuyên khoa này?')) return;
    try {
      await specialtyService.remove(id);
      toast.success('Đã xóa');
      fetchSpecialties();
    } catch { toast.error('Lỗi xóa'); }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Quản lý chuyên khoa</h1>
      <p className="page-subtitle">Thêm, sửa, xóa chuyên khoa</p>

      <form className="glass-card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-end' }}
        onSubmit={handleCreate} id="create-specialty-form">
        <div className="form-group" style={{ flex: 1 }}>
          <label className="label">Tên chuyên khoa mới</label>
          <input className="input-field" placeholder="VD: Ophthalmology" value={newName}
            onChange={(e) => setNewName(e.target.value)} id="specialty-name" />
        </div>
        <button type="submit" className="btn-primary" style={{ height: '48px' }} disabled={creating}>
          <FiPlus /> Thêm
        </button>
      </form>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Số bác sĩ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {specialties.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>
                  {editId === s.id ? (
                    <input className="input-field" value={editName}
                      onChange={(e) => setEditName(e.target.value)} style={{ padding: '8px 12px' }} autoFocus />
                  ) : (
                    <strong>{s.name}</strong>
                  )}
                </td>
                <td>{s.doctor_count}</td>
                <td>
                  {editId === s.id ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-success btn-sm" onClick={() => handleUpdate(s.id)}><FiCheck /></button>
                      <button className="btn-secondary btn-sm" onClick={() => setEditId(null)}><FiX /></button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-secondary btn-sm" onClick={() => { setEditId(s.id); setEditName(s.name); }}>
                        <FiEdit2 />
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(s.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSpecialties;
