using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoctailDebucle.Server.Migrations
{
    /// <inheritdoc />
    public partial class ImageToDrink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "Drinks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "Drinks");
        }
    }
}
