using System;
using Bookingweb.Enums;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Bookingweb.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatarAndAddressToDoctor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Baseline migration already exists in the database schema.
            // No-op to avoid re-creating existing types and tables.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No-op rollback because baseline schema already existed before migrations.
        }
    }
}
