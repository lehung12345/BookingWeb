using Bookingweb.DTOs;
using Bookingweb.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Bookingweb.Services
{
    public class DoctorService
    {
        private readonly AppDbContext _context;
        private readonly CloudinaryService _cloudinaryService;

        public DoctorService(AppDbContext context, CloudinaryService cloudinaryService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
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

        public async Task<bool> UpdateDoctorProfile(Guid userId, UpdateDoctorRequest request, IFormFile? avatar)
        {
            var doctor = await _context.doctors
                .Include(d => d.user)
                .FirstOrDefaultAsync(d => d.user_id == userId);
            if (doctor == null) return false;

            if (avatar != null)
            {
                var avatarUrl = await _cloudinaryService.UploadImageAsync(avatar);
                if (avatarUrl != null)
                    doctor.avatar_url = avatarUrl;
            }

            if (!string.IsNullOrEmpty(request.full_name))
                doctor.user.full_name = request.full_name;

            if (!string.IsNullOrEmpty(request.phone))
                doctor.user.phone = request.phone;

            if (request.description != null)
                doctor.description = request.description;

            if (request.experience_years.HasValue)
                doctor.experience_years = request.experience_years.Value;

            if (request.avatar_url != null)
                doctor.avatar_url = request.avatar_url;

            if (request.address != null)
                doctor.address = request.address;

            await _context.SaveChangesAsync();
            return true;
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
