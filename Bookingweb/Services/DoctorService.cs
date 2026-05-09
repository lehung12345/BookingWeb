using Bookingweb.DTOs;
using Bookingweb.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookingweb.Services
{
    public class DoctorService
    {
        private readonly AppDbContext _context;

        public DoctorService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DoctorDto>> GetAllDoctors()
        {
            return await _context.doctors
                .Include(d => d.user)
                .Include(d => d.specialty)
                .Select(d => new DoctorDto
                {
                    id = d.id,
                    user_id = d.user_id,
                    full_name = d.user.full_name,
                    email = d.user.email,
                    phone = d.user.phone,
                    specialty_id = d.specialty_id,
                    specialty_name = d.specialty != null ? d.specialty.name : null,
                    description = d.description,
                    experience_years = d.experience_years,
                    avatar_url = d.avatar_url,
                    address = d.address
                })
                .ToListAsync();
        }

        public async Task<DoctorDto?> GetDoctorById(Guid id)
        {
            return await _context.doctors
                .Include(d => d.user)
                .Include(d => d.specialty)
                .Where(d => d.id == id)
                .Select(d => new DoctorDto
                {
                    id = d.id,
                    user_id = d.user_id,
                    full_name = d.user.full_name,
                    email = d.user.email,
                    phone = d.user.phone,
                    specialty_id = d.specialty_id,
                    specialty_name = d.specialty != null ? d.specialty.name : null,
                    description = d.description,
                    experience_years = d.experience_years,
                    avatar_url = d.avatar_url,
                    address = d.address
                })
                .FirstOrDefaultAsync();
        }

        public async Task<DoctorDto?> GetDoctorByUserId(Guid userId)
        {
            return await _context.doctors
                .Include(d => d.user)
                .Include(d => d.specialty)
                .Where(d => d.user_id == userId)
                .Select(d => new DoctorDto
                {
                    id = d.id,
                    user_id = d.user_id,
                    full_name = d.user.full_name,
                    email = d.user.email,
                    phone = d.user.phone,
                    specialty_id = d.specialty_id,
                    specialty_name = d.specialty != null ? d.specialty.name : null,
                    description = d.description,
                    experience_years = d.experience_years,
                    avatar_url = d.avatar_url,
                    address = d.address
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<DoctorDto>> GetDoctorsBySpecialty(int specialtyId)
        {
            return await _context.doctors
                .Include(d => d.user)
                .Include(d => d.specialty)
                .Where(d => d.specialty_id == specialtyId)
                .Select(d => new DoctorDto
                {
                    id = d.id,
                    user_id = d.user_id,
                    full_name = d.user.full_name,
                    email = d.user.email,
                    phone = d.user.phone,
                    specialty_id = d.specialty_id,
                    specialty_name = d.specialty != null ? d.specialty.name : null,
                    description = d.description,
                    experience_years = d.experience_years,
                    avatar_url = d.avatar_url,
                    address = d.address
                })
                .ToListAsync();
        }
    }
}
