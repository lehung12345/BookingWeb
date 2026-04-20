using Bookingweb.DTOs;
using Bookingweb.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bookingweb.Controllers
{
    [ApiController]
    [Route("api/schedules")]
    public class ScheduleController : ControllerBase
    {
        private readonly ScheduleService _service;
        private readonly DoctorService _doctorService;

        public ScheduleController(ScheduleService service, DoctorService doctorService)
        {
            _service = service;
            _doctorService = doctorService;
        }

        // 📋 GET SCHEDULES BY DOCTOR (public)
        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetByDoctor(Guid doctorId)
        {
            var schedules = await _service.GetSchedulesByDoctor(doctorId);
            return Ok(schedules);
        }

        // 📋 GET AVAILABLE SCHEDULES (public)
        [HttpGet("available/{doctorId}")]
        public async Task<IActionResult> GetAvailable(Guid doctorId)
        {
            var schedules = await _service.GetAvailableSchedules(doctorId);
            return Ok(schedules);
        }

        // 📋 GET MY SCHEDULES (doctor)
        [HttpGet("me")]
        [Authorize(Roles = "DOCTOR")]
        public async Task<IActionResult> GetMySchedules()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _doctorService.GetDoctorByUserId(Guid.Parse(userId));
            if (doctor == null) return NotFound(new { error = "Không tìm thấy hồ sơ bác sĩ" });

            var schedules = await _service.GetSchedulesByDoctor(doctor.id);
            return Ok(schedules);
        }

        // ➕ CREATE SCHEDULE (doctor)
        [HttpPost]
        [Authorize(Roles = "DOCTOR")]
        public async Task<IActionResult> Create([FromBody] CreateScheduleRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _doctorService.GetDoctorByUserId(Guid.Parse(userId));
            if (doctor == null) return NotFound(new { error = "Không tìm thấy hồ sơ bác sĩ" });

            var schedule = await _service.CreateSchedule(doctor.id, request);
            return Ok(schedule);
        }

        // 🗑️ DELETE SCHEDULE (doctor)
        [HttpDelete("{id}")]
        [Authorize(Roles = "DOCTOR")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _doctorService.GetDoctorByUserId(Guid.Parse(userId));
            if (doctor == null) return NotFound(new { error = "Không tìm thấy hồ sơ bác sĩ" });

            var result = await _service.DeleteSchedule(id, doctor.id);
            if (!result) return NotFound(new { error = "Không tìm thấy lịch" });

            return Ok(new { message = "Xóa lịch thành công" });
        }
    }
}
