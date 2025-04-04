using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoctailDebucle.Server.Migrations
{
    /// <inheritdoc />
    public partial class gdprConsent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "GdprConsent",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GdprConsent",
                table: "Users");
        }
    }
}
