using Bookingweb.DTOs;
using Bookingweb.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookingweb.Services
{
    public class ScheduleService
    {
        private readonly AppDbContext _context;

        public ScheduleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ScheduleDto>> GetSchedulesByDoctor(Guid doctorId)
        {
            var today = DateOnly.FromDateTime(DateTime.Now);
            var timeNow = TimeOnly.FromDateTime(DateTime.Now);

            return await _context.schedules
                .Include(s => s.doctor).ThenInclude(d => d.user)
                .Where(s => s.doctor_id == doctorId)
                .OrderBy(s => s.work_date).ThenBy(s => s.start_time)
                .Select(s => new ScheduleDto
                {
                    id = s.id,
                    doctor_id = s.doctor_id,
                    doctor_name = s.doctor.user.full_name,
                    work_date = s.work_date,
                    start_time = s.start_time,
                    end_time = s.end_time,
                    is_booked = s.work_date < today || (s.work_date == today && s.end_time <= timeNow)
                })
                .ToListAsync();
        }

        public async Task<List<ScheduleDto>> GetAvailableSchedules(Guid doctorId)
        {
            var today = DateOnly.FromDateTime(DateTime.Now);
            var timeNow = TimeOnly.FromDateTime(DateTime.Now);

            return await _context.schedules
                .Include(s => s.doctor).ThenInclude(d => d.user)
                .Where(s => s.doctor_id == doctorId && s.work_date >= today)
                .OrderBy(s => s.work_date).ThenBy(s => s.start_time)
                .Select(s => new ScheduleDto
                {
                    id = s.id,
                    doctor_id = s.doctor_id,
                    doctor_name = s.doctor.user.full_name,
                    work_date = s.work_date,
                    start_time = s.start_time,
                    end_time = s.end_time,
                    is_booked = s.work_date < today || (s.work_date == today && s.end_time <= timeNow)
                })
                .ToListAsync();
        }

        public async Task<ScheduleDto> CreateSchedule(Guid doctorId, CreateScheduleRequest request)
        {
            var schedule = new schedule
            {
                doctor_id = doctorId,
                work_date = request.work_date,
                start_time = request.start_time,
                end_time = request.end_time
            };

            _context.schedules.Add(schedule);
            await _context.SaveChangesAsync();

            var doctor = await _context.doctors.Include(d => d.user).FirstOrDefaultAsync(d => d.id == doctorId);

            return new ScheduleDto
            {
                id = schedule.id,
                doctor_id = schedule.doctor_id,
                doctor_name = doctor?.user.full_name,
                work_date = schedule.work_date,
                start_time = schedule.start_time,
                end_time = schedule.end_time,
                is_booked = false
            };
        }

        public async Task<bool> DeleteSchedule(Guid scheduleId, Guid doctorId)
        {
            var schedule = await _context.schedules
                .FirstOrDefaultAsync(s => s.id == scheduleId && s.doctor_id == doctorId);

            if (schedule == null) return false;

            _context.schedules.Remove(schedule);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
