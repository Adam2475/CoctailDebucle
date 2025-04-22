using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoctailDebucle.Server.Migrations
{
    /// <inheritdoc />
    public partial class ActivationFieldSelection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isActive",
                table: "Selections",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isActive",
                table: "Selections");
        }
    }
}
