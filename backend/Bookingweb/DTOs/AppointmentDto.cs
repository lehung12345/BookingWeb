using Bookingweb.Enums;

namespace Bookingweb.DTOs
{
    public class AppointmentDto
    {
        public Guid id { get; set; }
        public Guid user_id { get; set; }
        public string? patient_name { get; set; }
        public string? patient_email { get; set; }
        public string? patient_phone { get; set; }
        public Guid doctor_id { get; set; }
        public string? doctor_name { get; set; }
        public string? specialty_name { get; set; }
        public Guid schedule_id { get; set; }
        public DateOnly? work_date { get; set; }
        public TimeOnly? start_time { get; set; }
        public TimeOnly? end_time { get; set; }
        public AppointmentStatus status { get; set; }
        public string? note { get; set; }
        public DateTime? created_at { get; set; }
    }

    public class CreateAppointmentRequest
    {
        public Guid doctor_id { get; set; }
        public Guid schedule_id { get; set; }
        public string? note { get; set; }
    }

    public class UpdateAppointmentStatusRequest
    {
        public AppointmentStatus status { get; set; }
        public string? note { get; set; }
    }
}
