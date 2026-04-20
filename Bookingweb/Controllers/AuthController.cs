using Bookingweb.DTOs;
using Bookingweb.Models;
using Bookingweb.Services;
using Bookingweb.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bookingweb.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _service;
        private readonly AppDbContext _context;

        public AuthController(AuthService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        // 🔐 REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { error = string.Join(", ", errors) });
            }

            var result = await _service.Register(request);

            if (result != "Đăng ký thành công")
                return BadRequest(new { error = result });

            return Ok(new { message = result });
        }

        // 🔐 LOGIN
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.email) || string.IsNullOrEmpty(request.password))
                return BadRequest(new { error = "Email và mật khẩu không được để trống" });

            if (string.IsNullOrEmpty(request.role))
                return BadRequest(new { error = "Vui lòng chọn vai trò đăng nhập" });

            var result = _service.Login(request);
            if (result == null)
                return Unauthorized(new { error = "Sai tài khoản hoặc mật khẩu" });

            return Ok(result);
        }

        // 👤 GET CURRENT USER
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetMe()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = _context.users.FirstOrDefault(u => u.id == Guid.Parse(userId));
            if (user == null) return NotFound();

            return Ok(new UserDto
            {
                id = user.id,
                full_name = user.full_name,
                email = user.email,
                phone = user.phone,
                role = user.Role,
                created_at = user.created_at
            });
        }

        // ✏️ UPDATE PROFILE
        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = _context.users.FirstOrDefault(u => u.id == Guid.Parse(userId));
            if (user == null) return NotFound();

            if (!string.IsNullOrEmpty(request.full_name))
                user.full_name = request.full_name;
            if (request.phone != null)
                user.phone = request.phone;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thành công" });
        }

        // 🔐 CHANGE PASSWORD
        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var result = await _service.ChangePassword(Guid.Parse(userId), request);

            if (result != "Đổi mật khẩu thành công")
                return BadRequest(new { error = result });

            return Ok(new { message = result });
        }
    }
}
