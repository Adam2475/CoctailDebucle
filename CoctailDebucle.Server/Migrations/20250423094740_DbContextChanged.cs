using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoctailDebucle.Server.Migrations
{
    /// <inheritdoc />
    public partial class DbContextChanged : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SelectionId1",
                table: "Drinks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Drinks_SelectionId1",
                table: "Drinks",
                column: "SelectionId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Drinks_Selections_SelectionId1",
                table: "Drinks",
                column: "SelectionId1",
                principalTable: "Selections",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Drinks_Selections_SelectionId1",
                table: "Drinks");

            migrationBuilder.DropIndex(
                name: "IX_Drinks_SelectionId1",
                table: "Drinks");

            migrationBuilder.DropColumn(
                name: "SelectionId1",
                table: "Drinks");
        }
    }
}
