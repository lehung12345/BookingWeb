using System.ComponentModel.DataAnnotations;

namespace Bookingweb.DTOs
{
    public class DoctorDto
    {
        public Guid id { get; set; }
        public Guid user_id { get; set; }
        public string full_name { get; set; } = null!;
        public string email { get; set; } = null!;
        public string? phone { get; set; }
        public int? specialty_id { get; set; }
        public string? specialty_name { get; set; }
        public string? description { get; set; }
        public int? experience_years { get; set; }
    }

    public class CreateDoctorRequest
    {
        public string full_name { get; set; } = null!;
        public string email { get; set; } = null!;
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d).{6,}$", ErrorMessage = "Mật khẩu phải ít nhất 6 ký tự và chứa cả chữ và số")]
        public string password { get; set; } = null!;

        [RegularExpression(@"^0\d{9}$", ErrorMessage = "Số điện thoại phải là 10 chữ số và bắt đầu bằng 0")]
        public string? phone { get; set; }

        public int? specialty_id { get; set; }
        public string? description { get; set; }
        public int? experience_years { get; set; }
    }

    public class UpdateDoctorRequest
    {
        public string? full_name { get; set; }

        [RegularExpression(@"^0\d{9}$", ErrorMessage = "Số điện thoại phải là 10 chữ số và bắt đầu bằng 0")]
        public string? phone { get; set; }
        public int? specialty_id { get; set; }
        public string? description { get; set; }
        public int? experience_years { get; set; }
    }
}
