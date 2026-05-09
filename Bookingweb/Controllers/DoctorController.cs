using Bookingweb.DTOs;
using Bookingweb.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bookingweb.Controllers
{
    [ApiController]
    [Route("api/doctors")]
    public class DoctorController : ControllerBase
    {
        private readonly DoctorService _service;

        public DoctorController(DoctorService service)
        {
            _service = service;
        }

        // 📋 GET ALL DOCTORS
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var doctors = await _service.GetAllDoctors();
            return Ok(doctors);
        }

        // 🔍 GET DOCTOR BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var doctor = await _service.GetDoctorById(id);
            if (doctor == null) return NotFound(new { error = "Không tìm thấy bác sĩ" });
            return Ok(doctor);
        }

        // 🩺 GET MY DOCTOR PROFILE (for logged-in doctor)
        [HttpGet("me")]
        [Authorize(Roles = "DOCTOR")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _service.GetDoctorByUserId(Guid.Parse(userId));
            if (doctor == null) return NotFound(new { error = "Không tìm thấy hồ sơ bác sĩ" });
            return Ok(doctor);
        }

        // ✏️ UPDATE MY DOCTOR PROFILE
        [HttpPut("me")]
        [Authorize(Roles = "DOCTOR")]
        public async Task<IActionResult> UpdateMyProfile([FromForm] UpdateDoctorRequest request, IFormFile? avatar)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var updated = await _service.UpdateDoctorProfile(Guid.Parse(userId), request, avatar);
            if (!updated) return NotFound(new { error = "Không tìm thấy hồ sơ bác sĩ" });
            return Ok(new { message = "Cập nhật hồ sơ bác sĩ thành công" });
        }

        // 🔍 GET DOCTORS BY SPECIALTY
        [HttpGet("specialty/{specialtyId}")]
        public async Task<IActionResult> GetBySpecialty(int specialtyId)
        {
            var doctors = await _service.GetDoctorsBySpecialty(specialtyId);
            return Ok(doctors);
        }
    }
}
