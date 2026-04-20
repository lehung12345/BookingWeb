using Bookingweb.DTOs;
using Bookingweb.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookingweb.Services
{
    public class SpecialtyService
    {
        private readonly AppDbContext _context;

        public SpecialtyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SpecialtyDto>> GetAll()
        {
            return await _context.specialties
                .Include(s => s.doctors)
                .Select(s => new SpecialtyDto
                {
                    id = s.id,
                    name = s.name,
                    doctor_count = s.doctors.Count
                })
                .ToListAsync();
        }

        public async Task<SpecialtyDto?> GetById(int id)
        {
            return await _context.specialties
                .Include(s => s.doctors)
                .Where(s => s.id == id)
                .Select(s => new SpecialtyDto
                {
                    id = s.id,
                    name = s.name,
                    doctor_count = s.doctors.Count
                })
                .FirstOrDefaultAsync();
        }

        public async Task<SpecialtyDto> Create(CreateSpecialtyRequest request)
        {
            var specialty = new specialty { name = request.name };
            _context.specialties.Add(specialty);
            await _context.SaveChangesAsync();

            return new SpecialtyDto { id = specialty.id, name = specialty.name, doctor_count = 0 };
        }

        public async Task<bool> Update(int id, CreateSpecialtyRequest request)
        {
            var specialty = await _context.specialties.FindAsync(id);
            if (specialty == null) return false;

            specialty.name = request.name;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var specialty = await _context.specialties.FindAsync(id);
            if (specialty == null) return false;

            _context.specialties.Remove(specialty);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
