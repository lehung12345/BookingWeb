using System;
using System.Collections.Generic;

namespace Bookingweb.Models;

public partial class schedule
{
    public Guid id { get; set; }

    public Guid doctor_id { get; set; }

    public DateOnly work_date { get; set; }

    public TimeOnly start_time { get; set; }

    public TimeOnly end_time { get; set; }

    public virtual ICollection<appointment> appointments { get; set; } = new List<appointment>();

    public virtual doctor doctor { get; set; } = null!;
}
