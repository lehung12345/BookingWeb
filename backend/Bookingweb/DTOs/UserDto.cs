using Bookingweb.Enums;

namespace Bookingweb.DTOs
{
    public class UserDto
    {
        public Guid id { get; set; }
        public string full_name { get; set; } = null!;
        public string email { get; set; } = null!;
        public string? phone { get; set; }
        public UserRole role { get; set; }
        public DateTime? created_at { get; set; }
    }

    public class UpdateProfileRequest
    {
        public string? full_name { get; set; }
        public string? phone { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string current_password { get; set; } = null!;
        public string new_password { get; set; } = null!;
    }
}
