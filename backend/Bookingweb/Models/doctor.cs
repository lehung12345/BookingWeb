using System;
using System.Collections.Generic;

namespace Bookingweb.Models;

public partial class doctor
{
    public Guid id { get; set; }

    public Guid user_id { get; set; }

    public int? specialty_id { get; set; }

    public string? description { get; set; }

    public int? experience_years { get; set; }

    public virtual ICollection<appointment> appointments { get; set; } = new List<appointment>();

    public virtual ICollection<schedule> schedules { get; set; } = new List<schedule>();

    public virtual specialty? specialty { get; set; }

    public virtual user user { get; set; } = null!;
}
