//using System.Text.Json.Serialization;

//namespace Bookingweb.Enums
//{
//    [JsonConverter(typeof(JsonStringEnumConverter))]
//    public enum UserRole
//    {
//        USER,
//        DOCTOR,
//        ADMIN
//    }
//}
using System.Text.Json.Serialization;
using NpgsqlTypes; // Thêm thư viện này

namespace Bookingweb.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserRole
    {
        [PgName("USER")]
        USER,

        [PgName("DOCTOR")]
        DOCTOR,

        [PgName("ADMIN")]
        ADMIN
    }
}