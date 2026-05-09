using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bookingweb.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorAvatarAndAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE doctors ADD COLUMN IF NOT EXISTS address text;");
            migrationBuilder.Sql("ALTER TABLE doctors ADD COLUMN IF NOT EXISTS avatar_url text;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "address",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "avatar_url",
                table: "doctors");
        }
    }
}
