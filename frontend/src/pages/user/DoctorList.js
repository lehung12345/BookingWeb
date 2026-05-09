import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { specialtyService } from '../../services/specialtyService';
import { FiSearch, FiFilter } from 'react-icons/fi';
import './DoctorList.css';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSpecialty = searchParams.get('specialty') || '';

  useEffect(() => {
    specialtyService.getAll().then(res => setSpecialties(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchDoctors = selectedSpecialty
      ? doctorService.getBySpecialty(selectedSpecialty)
      : doctorService.getAll();

    fetchDoctors
      .then(res => setDoctors(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedSpecialty]);

  const filtered = doctors.filter(d =>
    d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Danh sách bác sĩ</h1>
      <p className="page-subtitle">Tìm và đặt lịch với bác sĩ phù hợp</p>

      {/* Filters */}
      <div className="doctor-filters" id="doctor-filters">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Tìm kiếm bác sĩ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="doctor-search"
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <div className="specialty-filters">
          <FiFilter className="filter-icon" />
          <button
            className={`filter-chip ${!selectedSpecialty ? 'active' : ''}`}
            onClick={() => setSearchParams({})}
          >
            Tất cả
          </button>
          {specialties.map(s => (
            <button
              key={s.id}
              className={`filter-chip ${selectedSpecialty === String(s.id) ? 'active' : ''}`}
              onClick={() => setSearchParams({ specialty: s.id })}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>😔</p>
          <p>Không tìm thấy bác sĩ nào</p>
        </div>
      ) : (
        <div className="doctors-grid">
          {filtered.map(d => (
            <Link to={`/doctor/${d.id}`} key={d.id} className="doctor-card glass-card" id={`doctor-card-${d.id}`}>
              <div className="dc-avatar">
                {d.avatar_url ? (
                  <img src={d.avatar_url} alt={d.full_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  d.full_name?.charAt(0) || 'D'
                )}
              </div>
              <div className="dc-info">
                <h3>BS. {d.full_name}</h3>
                <span className="dc-specialty">{d.specialty_name || 'Đa khoa'}</span>
                <p className="dc-desc">{d.description || 'Bác sĩ chuyên khoa'}</p>
                <div className="dc-meta">
                  <span>🎓 {d.experience_years || 0} năm kinh nghiệm</span>
                </div>
              </div>
              <div className="dc-action">
                <span className="btn-primary btn-sm">Đặt lịch</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
