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
        public string password { get; set; } = null!;
        public string? phone { get; set; }
        public int? specialty_id { get; set; }
        public string? description { get; set; }
        public int? experience_years { get; set; }
    }

    public class UpdateDoctorRequest
    {
        public string? full_name { get; set; }
        public string? phone { get; set; }
        public int? specialty_id { get; set; }
        public string? description { get; set; }
        public int? experience_years { get; set; }
    }
}
