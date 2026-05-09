using Bookingweb.DTOs;
using Bookingweb.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Bookingweb.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _service;
        private readonly AppointmentService _appointmentService;

        public AdminController(AdminService service, AppointmentService appointmentService)
        {
            _service = service;
            _appointmentService = appointmentService;
        }

        // 📊 DASHBOARD
        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            var stats = await _service.GetDashboard();
            return Ok(stats);
        }

        // 👥 GET ALL USERS
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _service.GetAllUsers();
            return Ok(users);
        }

        // 🗑️ DELETE USER
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var result = await _service.DeleteUser(id);
            if (!result) return NotFound(new { error = "Không tìm thấy người dùng" });
            return Ok(new { message = "Xóa thành công" });
        }

        // ➕ CREATE DOCTOR
        [HttpPost("doctors")]
        public async Task<IActionResult> CreateDoctor([FromForm] CreateDoctorRequest request, IFormFile? avatar)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { error = string.Join(", ", errors) });
            }

            var result = await _service.CreateDoctor(request, avatar);

            var type = result.GetType();
            var errorProp = type.GetProperty("error");
            if (errorProp != null)
            {
                var errorValue = errorProp.GetValue(result)?.ToString();
                return BadRequest(new { error = errorValue });
            }

            return Ok(result);
        }

        // ✏️ UPDATE DOCTOR
        [HttpPut("doctors/{id}")]
        public async Task<IActionResult> UpdateDoctor(Guid id, [FromForm] UpdateDoctorRequest request, IFormFile? avatar)
        {
            var result = await _service.UpdateDoctor(id, request, avatar);
            if (!result) return NotFound(new { error = "Không tìm thấy bác sĩ" });
            return Ok(new { message = "Cập nhật thành công" });
        }

        // 🗑️ DELETE DOCTOR
        [HttpDelete("doctors/{id}")]
        public async Task<IActionResult> DeleteDoctor(Guid id)
        {
            var result = await _service.DeleteDoctor(id);
            if (!result) return NotFound(new { error = "Không tìm thấy bác sĩ" });
            return Ok(new { message = "Xóa thành công" });
        }

        // 📋 GET ALL APPOINTMENTS
        [HttpGet("appointments")]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _appointmentService.GetAllAppointments();
            return Ok(appointments);
        }

        // 🔄 UPDATE APPOINTMENT STATUS
        [HttpPut("appointments/{id}/status")]
        public async Task<IActionResult> UpdateAppointmentStatus(Guid id, [FromBody] Bookingweb.DTOs.UpdateAppointmentStatusRequest request)
        {
            var result = await _service.UpdateAppointmentStatus(id, request.status);
            if (!result) return NotFound(new { error = "Không tìm thấy lịch hẹn" });
            return Ok(new { message = "Cập nhật thành công" });
        }
    }
}
