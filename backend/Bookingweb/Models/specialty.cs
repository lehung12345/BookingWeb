using System;
using System.Collections.Generic;

namespace Bookingweb.Models;

public partial class specialty
{
    public int id { get; set; }

    public string name { get; set; } = null!;

    public virtual ICollection<doctor> doctors { get; set; } = new List<doctor>();
}
