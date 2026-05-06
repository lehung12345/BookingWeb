using Bookingweb.DTOs;
using Bookingweb.Enums;
using Bookingweb.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookingweb.Services
{
    public class AdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardDto> GetDashboard()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);

            var totalUsers = await _context.users.CountAsync(u => u.Role == UserRole.USER);
            var totalDoctors = await _context.doctors.CountAsync();
            var totalAppointments = await _context.appointments.CountAsync();
            var todayAppointments = await _context.appointments
                .Include(a => a.schedule)
                .CountAsync(a => a.schedule.work_date == today);
            var pending = await _context.appointments.CountAsync(a => a.Status == AppointmentStatus.PENDING);
            var confirmed = await _context.appointments.CountAsync(a => a.Status == AppointmentStatus.CONFIRMED);
            var completed = await _context.appointments.CountAsync(a => a.Status == AppointmentStatus.COMPLETED);
            var cancelled = await _context.appointments.CountAsync(a => a.Status == AppointmentStatus.CANCELLED);

            return new AdminDashboardDto
            {
                total_users = totalUsers,
                total_doctors = totalDoctors,
                total_appointments = totalAppointments,
                today_appointments = todayAppointments,
                pending_appointments = pending,
                confirmed_appointments = confirmed,
                completed_appointments = completed,
                cancelled_appointments = cancelled
            };
        }

        public async Task<List<UserDto>> GetAllUsers()
        {
            return await _context.users
                .OrderByDescending(u => u.created_at)
                .Select(u => new UserDto
                {
                    id = u.id,
                    full_name = u.full_name,
                    email = u.email,
                    phone = u.phone,
                    role = u.Role,
                    created_at = u.created_at
                })
                .ToListAsync();
        }

        public async Task<bool> DeleteUser(Guid id)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null) return false;

            _context.users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<object> CreateDoctor(CreateDoctorRequest request)
        {
            // Check email
            var exists = await _context.users.AnyAsync(u => u.email == request.email);
            if (exists)
                return new { error = "Email đã tồn tại" };

            var newUser = new user
            {
                full_name = request.full_name,
                email = request.email,
                password = BCrypt.Net.BCrypt.HashPassword(request.password),
                phone = request.phone,
                Role = UserRole.DOCTOR
            };

            _context.users.Add(newUser);
            await _context.SaveChangesAsync();

            var newDoctor = new doctor
            {
                user_id = newUser.id,
                specialty_id = request.specialty_id,
                description = request.description,
                experience_years = request.experience_years ?? 0
            };

            _context.doctors.Add(newDoctor);
            await _context.SaveChangesAsync();

            return new
            {
                message = "Tạo bác sĩ thành công",
                doctor = new DoctorDto
                {
                    id = newDoctor.id,
                    user_id = newUser.id,
                    full_name = newUser.full_name,
                    email = newUser.email,
                    phone = newUser.phone,
                    specialty_id = newDoctor.specialty_id,
                    description = newDoctor.description,
                    experience_years = newDoctor.experience_years
                }
            };
        }

        public async Task<bool> UpdateDoctor(Guid doctorId, UpdateDoctorRequest request)
        {
            var doc = await _context.doctors
                .Include(d => d.user)
                .FirstOrDefaultAsync(d => d.id == doctorId);
            if (doc == null) return false;

            if (!string.IsNullOrEmpty(request.full_name))
                doc.user.full_name = request.full_name;
if (!string.IsNullOrEmpty(request.phone))
                doc.user.phone = request.phone;
            if (request.specialty_id.HasValue)
                doc.specialty_id = request.specialty_id;
            if (request.description != null)
                doc.description = request.description;
            if (request.experience_years.HasValue)
                doc.experience_years = request.experience_years;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDoctor(Guid doctorId)
        {
            var doc = await _context.doctors.Include(d => d.user).FirstOrDefaultAsync(d => d.id == doctorId);
            if (doc == null) return false;

            _context.doctors.Remove(doc);
            _context.users.Remove(doc.user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAppointmentStatus(Guid id, AppointmentStatus status)
        {
            var appointment = await _context.appointments.FindAsync(id);
            if (appointment == null) return false;

            appointment.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
