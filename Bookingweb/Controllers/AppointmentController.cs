using Bookingweb.DTOs;
using Bookingweb.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bookingweb.Controllers
{
    [ApiController]
    [Route("api/appointments")]
    public class AppointmentController : ControllerBase
    {
        private readonly AppointmentService _service;
        private readonly DoctorService _doctorService;

        public AppointmentController(AppointmentService service, DoctorService doctorService)
        {
            _service = service;
            _doctorService = doctorService;
        }

        // ➕ BOOK APPOINTMENT (user)
        [HttpPost]
        [Authorize(Roles = "USER")]
        public async Task<IActionResult> Book([FromBody] CreateAppointmentRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var result = await _service.CreateAppointment(Guid.Parse(userId), request);

            // Check if error
            var type = result.GetType();
            var errorProp = type.GetProperty("error");
            if (errorProp != null)
            {
                var errorValue = errorProp.GetValue(result)?.ToString();
                return BadRequest(new { error = errorValue });
            }

            return Ok(result);
        }

        // 📋 GET MY APPOINTMENTS (user)
        [HttpGet("my")]
        [Authorize(Roles = "USER")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var appointments = await _service.GetUserAppointments(Guid.Parse(userId));
            return Ok(appointments);
        }

        // 📋 GET DOCTOR'S APPOINTMENTS (doctor)
        [HttpGet("doctor")]
        [Authorize(Roles = "DOCTOR")]
        public async Task<IActionResult> GetDoctorAppointments()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _doctorService.GetDoctorByUserId(Guid.Parse(userId));
            if (doctor == null) return NotFound(new { error = "Không tìm thấy hồ sơ bác sĩ" });

            var appointments = await _service.GetDoctorAppointments(doctor.id);
            return Ok(appointments);
        }

        // ✏️ UPDATE STATUS (doctor)
        [HttpPut("{id}/status")]
        [Authorize(Roles = "DOCTOR")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateAppointmentStatusRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _doctorService.GetDoctorByUserId(Guid.Parse(userId));
            if (doctor == null) return NotFound(new { error = "Không tìm thấy hồ sơ bác sĩ" });

            var result = await _service.UpdateStatus(id, doctor.id, request);
            if (!result) return NotFound(new { error = "Không tìm thấy lịch hẹn" });

            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }

        // ❌ CANCEL APPOINTMENT (user)
        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "USER")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var result = await _service.CancelAppointment(id, Guid.Parse(userId));
            if (!result) return BadRequest(new { error = "Không thể hủy lịch hẹn này" });

            return Ok(new { message = "Hủy lịch thành công" });
        }

        // ✅ CONFIRM APPOINTMENT (user)
        [HttpPut("{id}/confirm")]
        [Authorize(Roles = "USER")]
        public async Task<IActionResult> Confirm(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var result = await _service.PatientConfirmAppointment(id, Guid.Parse(userId));
            if (!result) return BadRequest(new { error = "Không thể xác nhận lịch hẹn này" });

            return Ok(new { message = "Xác nhận thành công" });
        }
    }
}
