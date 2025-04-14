using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoctailDebucle.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserDrinkCreation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Drinks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Drinks_UserId",
                table: "Drinks",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Drinks_Users_UserId",
                table: "Drinks",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Drinks_Users_UserId",
                table: "Drinks");

            migrationBuilder.DropIndex(
                name: "IX_Drinks_UserId",
                table: "Drinks");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Drinks");
        }
    }
}
