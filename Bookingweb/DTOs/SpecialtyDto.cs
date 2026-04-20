using System.ComponentModel.DataAnnotations;

namespace Bookingweb.DTOs
{
    public class SpecialtyDto
    {
        public int id { get; set; }
        public string name { get; set; } = null!;
        public int doctor_count { get; set; }
    }

    public class CreateSpecialtyRequest
    {
        [Required(ErrorMessage = "Tên chuyên khoa không được để trống")]
        [MaxLength(100)]
        public string name { get; set; } = null!;
    }
}
