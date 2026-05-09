using System.ComponentModel.DataAnnotations;

namespace Bookingweb.DTOs
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Họ tên không được để trống")]
        [MaxLength(100)]
        public string full_name { get; set; } = null!;

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [MaxLength(150)]
        public string email { get; set; } = null!;

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d).{6,}$", ErrorMessage = "Mật khẩu phải ít nhất 6 ký tự và chứa cả chữ và số")]
        public string password { get; set; } = null!;

        [RegularExpression(@"^0\d{9}$", ErrorMessage = "Số điện thoại phải là 10 chữ số và bắt đầu bằng 0")]
        public string? phone { get; set; }
    }
}
