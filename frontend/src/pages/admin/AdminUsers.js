import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { FiTrash2, FiSearch } from 'react-icons/fi';
import './AdminPages.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    adminService.getUsers()
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa người dùng này?')) return;
    try {
      await adminService.deleteUser(id);
      toast.success('Đã xóa');
      fetchUsers();
    } catch { toast.error('Lỗi xóa'); }
  };

  const filtered = users.filter(u =>
    u.role === 'USER' &&
    (u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Quản lý người dùng</h1>
      <p className="page-subtitle">Danh sách tất cả người dùng hệ thống</p>

      <div className="search-box" style={{ marginBottom: '20px' }}>
        <FiSearch className="search-icon" />
        <input type="text" className="input-field" placeholder="Tìm kiếm..." value={search}
          onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} id="user-search" />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td><strong>{u.full_name}</strong></td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-confirmed' : u.role === 'DOCTOR' ? 'badge-completed' : 'badge-pending'}`}>
                    {u.role}
                  </span>
                </td>
                <td>{u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '—'}</td>
                <td>
                  {u.role !== 'ADMIN' && (
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(u.id)}>
                      <FiTrash2 />
                    </button>
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

export default AdminUsers;
