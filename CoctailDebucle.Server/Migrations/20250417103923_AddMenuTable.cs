using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoctailDebucle.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddMenuTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SelectionId",
                table: "Drinks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Selections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Selections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Selections_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Drinks_SelectionId",
                table: "Drinks",
                column: "SelectionId");

            migrationBuilder.CreateIndex(
                name: "IX_Selections_UserId",
                table: "Selections",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Drinks_Selections_SelectionId",
                table: "Drinks",
                column: "SelectionId",
                principalTable: "Selections",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Drinks_Selections_SelectionId",
                table: "Drinks");

            migrationBuilder.DropTable(
                name: "Selections");

            migrationBuilder.DropIndex(
                name: "IX_Drinks_SelectionId",
                table: "Drinks");

            migrationBuilder.DropColumn(
                name: "SelectionId",
                table: "Drinks");
        }
    }
}
