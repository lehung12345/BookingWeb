using Bookingweb.DTOs;
using Bookingweb.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bookingweb.Controllers
{
    [ApiController]
    [Route("api/specialties")]
    public class SpecialtyController : ControllerBase
    {
        private readonly SpecialtyService _service;

        public SpecialtyController(SpecialtyService service)
        {
            _service = service;
        }

        // 📋 GET ALL (public)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var specialties = await _service.GetAll();
            return Ok(specialties);
        }

        // 🔍 GET BY ID (public)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var specialty = await _service.GetById(id);
            if (specialty == null) return NotFound(new { error = "Không tìm thấy chuyên khoa" });
            return Ok(specialty);
        }

        // ➕ CREATE (admin)
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Create([FromBody] CreateSpecialtyRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var specialty = await _service.Create(request);
            return Ok(specialty);
        }

        // ✏️ UPDATE (admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSpecialtyRequest request)
        {
            var result = await _service.Update(id, request);
            if (!result) return NotFound(new { error = "Không tìm thấy chuyên khoa" });

            return Ok(new { message = "Cập nhật thành công" });
        }

        // 🗑️ DELETE (admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.Delete(id);
            if (!result) return NotFound(new { error = "Không tìm thấy chuyên khoa" });

            return Ok(new { message = "Xóa thành công" });
        }
    }
}
