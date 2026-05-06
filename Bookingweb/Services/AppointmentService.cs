using Bookingweb.DTOs;
using Bookingweb.Enums;
using Bookingweb.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookingweb.Services
{
    public class AppointmentService
    {
        private readonly AppDbContext _context;

        public AppointmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> CreateAppointment(Guid userId, CreateAppointmentRequest request)
        {
            // Check if schedule exists
            var schedule = await _context.schedules
                .Include(s => s.appointments)
                .FirstOrDefaultAsync(s => s.id == request.schedule_id);

            if (schedule == null)
                return new { error = "Lịch khám không tồn tại" };

            // Check if schedule has expired
            var today = DateOnly.FromDateTime(DateTime.Now);
            var timeNow = TimeOnly.FromDateTime(DateTime.Now);
            if (schedule.work_date < today || (schedule.work_date == today && schedule.end_time <= timeNow))
                return new { error = "Lịch khám này đã đóng do quá giờ" };

            // Check if user already has appointment at this schedule
            var existing = await _context.appointments
                .AnyAsync(a => a.user_id == userId && a.schedule_id == request.schedule_id && a.Status != AppointmentStatus.CANCELLED);
            if (existing)
                return new { error = "Bạn đã đặt lịch này rồi" };

            var appointment = new appointment
            {
                user_id = userId,
                doctor_id = request.doctor_id,
                schedule_id = request.schedule_id,
                note = request.note,
                Status = AppointmentStatus.PENDING
            };

            _context.appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return new { message = "Đặt lịch thành công", id = appointment.id };
        }

        public async Task<List<AppointmentDto>> GetUserAppointments(Guid userId)
        {
            return await _context.appointments
                .Include(a => a.doctor).ThenInclude(d => d.user)
                .Include(a => a.doctor).ThenInclude(d => d.specialty)
                .Include(a => a.schedule)
                .Include(a => a.user)
                .Where(a => a.user_id == userId)
                .OrderByDescending(a => a.created_at)
                .Select(a => MapToDto(a))
                .ToListAsync();
        }

        public async Task<List<AppointmentDto>> GetDoctorAppointments(Guid doctorId)
        {
            return await _context.appointments
                .Include(a => a.doctor).ThenInclude(d => d.user)
                .Include(a => a.doctor).ThenInclude(d => d.specialty)
                .Include(a => a.schedule)
                .Include(a => a.user)
                .Where(a => a.doctor_id == doctorId)
                .OrderByDescending(a => a.created_at)
                .Select(a => MapToDto(a))
                .ToListAsync();
        }

        public async Task<List<AppointmentDto>> GetAllAppointments()
        {
            return await _context.appointments
                .Include(a => a.doctor).ThenInclude(d => d.user)
                .Include(a => a.doctor).ThenInclude(d => d.specialty)
                .Include(a => a.schedule)
                .Include(a => a.user)
                .OrderByDescending(a => a.created_at)
                .Select(a => MapToDto(a))
                .ToListAsync();
        }

        public async Task<bool> UpdateStatus(Guid appointmentId, Guid doctorId, UpdateAppointmentStatusRequest request)
        {
            var appt = await _context.appointments
                .FirstOrDefaultAsync(a => a.id == appointmentId && a.doctor_id == doctorId);

            if (appt == null) return false;

            appt.Status = request.status;
            if (request.note != null)
                appt.note = request.note;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelAppointment(Guid appointmentId, Guid userId)
        {
            var appt = await _context.appointments
                .FirstOrDefaultAsync(a => a.id == appointmentId && a.user_id == userId);

            if (appt == null) return false;
            if (appt.Status == AppointmentStatus.COMPLETED || appt.Status == AppointmentStatus.CANCELLED)
                return false;

            appt.Status = AppointmentStatus.CANCELLED;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> PatientConfirmAppointment(Guid appointmentId, Guid userId)
        {
            var appt = await _context.appointments
                .FirstOrDefaultAsync(a => a.id == appointmentId && a.user_id == userId);

            if (appt == null) return false;
            if (appt.Status != AppointmentStatus.SCHEDULED)
                return false;

            appt.Status = AppointmentStatus.PATIENT_CONFIRMED;
            await _context.SaveChangesAsync();
            return true;
        }

        private static AppointmentDto MapToDto(appointment a)
        {
            return new AppointmentDto
            {
                id = a.id,
                user_id = a.user_id,
                patient_name = a.user.full_name,
                patient_email = a.user.email,
                patient_phone = a.user.phone,
                doctor_id = a.doctor_id,
                doctor_name = a.doctor.user.full_name,
                specialty_name = a.doctor.specialty != null ? a.doctor.specialty.name : null,
                schedule_id = a.schedule_id,
                work_date = a.schedule.work_date,
                start_time = a.schedule.start_time,
                end_time = a.schedule.end_time,
                status = a.Status,
                note = a.note,
                created_at = a.created_at
            };
        }
    }
}
