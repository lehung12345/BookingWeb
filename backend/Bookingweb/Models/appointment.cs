using System;
using System.Collections.Generic;
using Bookingweb.Enums;

namespace Bookingweb.Models;

public partial class appointment
{
    public Guid id { get; set; }

    public AppointmentStatus Status { get; set; }

    public Guid user_id { get; set; }

    public Guid doctor_id { get; set; }

    public Guid schedule_id { get; set; }

    public string? note { get; set; }

    public DateTime? created_at { get; set; }

    public virtual doctor doctor { get; set; } = null!;

    public virtual schedule schedule { get; set; } = null!;

    public virtual user user { get; set; } = null!;
}
