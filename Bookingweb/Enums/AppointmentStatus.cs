//namespace Bookingweb.Enums
//{
//    public enum AppointmentStatus
//    {
//        PENDING,
//        CONFIRMED,
//        COMPLETED,
//        CANCELLED
//    }
//}


using NpgsqlTypes;
using System.Text.Json.Serialization;

namespace Bookingweb.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum AppointmentStatus
    {
        [PgName("PENDING")]
        PENDING,

        [PgName("CONFIRMED")]
        CONFIRMED,

        [PgName("COMPLETED")]
        COMPLETED,

        [PgName("CANCELLED")]
        CANCELLED,

        [PgName("SCHEDULED")]
        SCHEDULED,

        [PgName("PATIENT_CONFIRMED")]
        PATIENT_CONFIRMED
    }
}