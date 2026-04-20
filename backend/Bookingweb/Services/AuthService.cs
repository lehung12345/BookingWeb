using Bookingweb.Models;
using Bookingweb.Enums;
using Bookingweb.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Bookingweb.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // 🔐 REGISTER
        public async Task<string> Register(RegisterRequest request)
        {
            var exists = _context.users.Any(u => u.email == request.email);
            if (exists) return "Email đã tồn tại";

            var newUser = new user
            {
                full_name = request.full_name,
                email = request.email,
                password = BCrypt.Net.BCrypt.HashPassword(request.password),
                phone = request.phone,
                Role = UserRole.USER
            };

            _context.users.Add(newUser);
            await _context.SaveChangesAsync();

            return "Đăng ký thành công";
        }

        // 🔐 LOGIN
        public object? Login(LoginRequest request)
        {
            // Tìm user theo email và role
            var user = _context.users.FirstOrDefault(u => u.email == request.email && u.Role.ToString() == request.role);
            if (user == null) return null;

            // Kiểm tra mật khẩu
            bool isValid = false;
            try
            {
                // Kiểm tra bằng BCrypt chuẩn
                isValid = BCrypt.Net.BCrypt.Verify(request.password, user.password);
            }
            catch
            {
                // Bỏ qua lỗi format chuỗi BCrypt nếu mật khẩu là plain-text
            }

            // 💡 Fallback Migration: Nếu chuỗi chưa băm và khớp text, tự động băm lại vào DB
            if (!isValid && user.password == request.password)
            {
                isValid = true;
                user.password = BCrypt.Net.BCrypt.HashPassword(request.password);
                _context.SaveChanges();
            }

            if (!isValid) return null;

            // Tạo JWT token
            var token = GenerateJwt(user);

            return new
            {
                token,
                user = new
                {
                    user.id,
                    user.email,
                    user.full_name,
                    user.phone,
                    role = user.Role.ToString()
                }
            };
        }

        public async Task<string> ChangePassword(Guid userId, ChangePasswordRequest request)
        {
            var user = await _context.users.FindAsync(userId);
            if (user == null) return "Người dùng không tồn tại";

            // Verify current password
            bool isValid = false;
            try {
                isValid = BCrypt.Net.BCrypt.Verify(request.current_password, user.password);
            } catch { }

            // Fallback for plain text (migration)
            if (!isValid && user.password == request.current_password) isValid = true;

            if (!isValid) return "Mật khẩu hiện tại không chính xác";

            // Hash new password
            user.password = BCrypt.Net.BCrypt.HashPassword(request.new_password);
            await _context.SaveChangesAsync();

            return "Đổi mật khẩu thành công";
        }

        // 🔥 TẠO TOKEN
        private string GenerateJwt(user user)
        {
            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? "Your_Super_Secret_Key_At_Least_32_Chars";
            var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "BookingWeb";
            var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "BookingWebUser";
            var expireMinutes = _config["Jwt:ExpireMinutes"] ?? "1440";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                new Claim(ClaimTypes.Email, user.email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(double.Parse(expireMinutes)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
