namespace Bookingweb.DTOs
{
    public class AdminDashboardDto
    {
        public int total_users { get; set; }
        public int total_doctors { get; set; }
        public int total_appointments { get; set; }
        public int today_appointments { get; set; }
        public int pending_appointments { get; set; }
        public int confirmed_appointments { get; set; }
        public int completed_appointments { get; set; }
        public int cancelled_appointments { get; set; }
    }
}
