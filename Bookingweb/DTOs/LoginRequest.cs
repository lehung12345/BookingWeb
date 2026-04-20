namespace Bookingweb.DTOs
{
    public class LoginRequest
    {
        public string email { get; set; }
        public string password { get; set; }
        public string role { get; set; } // "USER" hoặc "DOCTOR"
    }
}
