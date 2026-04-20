namespace Bookingweb.DTOs
{
    public class ScheduleDto
    {
        public Guid id { get; set; }
        public Guid doctor_id { get; set; }
        public string? doctor_name { get; set; }
        public DateOnly work_date { get; set; }
        public TimeOnly start_time { get; set; }
        public TimeOnly end_time { get; set; }
        public bool is_booked { get; set; }
    }

    public class CreateScheduleRequest
    {
        public DateOnly work_date { get; set; }
        public TimeOnly start_time { get; set; }
        public TimeOnly end_time { get; set; }
    }
}
