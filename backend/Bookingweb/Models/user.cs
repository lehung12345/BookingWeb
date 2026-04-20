using System;
using System.Collections.Generic;
using Bookingweb.Enums;

namespace Bookingweb.Models;

public partial class user
{
    public Guid id { get; set; }

    public UserRole Role { get; set; }

    public string full_name { get; set; } = null!;

    public string email { get; set; } = null!;

    public string password { get; set; } = null!;

    public string? phone { get; set; }

    public DateTime? created_at { get; set; }

    public virtual ICollection<appointment> appointments { get; set; } = new List<appointment>();

    public virtual doctor? doctor { get; set; }
}
