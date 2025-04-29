using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoctailDebucle.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixSelectionTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Drinks_Selections_SelectionId",
                table: "Drinks");

            migrationBuilder.DropForeignKey(
                name: "FK_Drinks_Selections_SelectionId1",
                table: "Drinks");

            migrationBuilder.DropIndex(
                name: "IX_Drinks_SelectionId",
                table: "Drinks");

            migrationBuilder.DropIndex(
                name: "IX_Drinks_SelectionId1",
                table: "Drinks");

            migrationBuilder.DropColumn(
                name: "SelectionId",
                table: "Drinks");

            migrationBuilder.DropColumn(
                name: "SelectionId1",
                table: "Drinks");

            migrationBuilder.AddColumn<bool>(
                name: "IsCreatedByUser",
                table: "Drinks",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "SelectionDrink",
                columns: table => new
                {
                    SelectionId = table.Column<int>(type: "int", nullable: false),
                    DrinkId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SelectionDrink", x => new { x.SelectionId, x.DrinkId });
                    table.ForeignKey(
                        name: "FK_SelectionDrink_Drinks_DrinkId",
                        column: x => x.DrinkId,
                        principalTable: "Drinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SelectionDrink_Selections_SelectionId",
                        column: x => x.SelectionId,
                        principalTable: "Selections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SelectionDrink_DrinkId",
                table: "SelectionDrink",
                column: "DrinkId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SelectionDrink");

            migrationBuilder.DropColumn(
                name: "IsCreatedByUser",
                table: "Drinks");

            migrationBuilder.AddColumn<int>(
                name: "SelectionId",
                table: "Drinks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SelectionId1",
                table: "Drinks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Drinks_SelectionId",
                table: "Drinks",
                column: "SelectionId");

            migrationBuilder.CreateIndex(
                name: "IX_Drinks_SelectionId1",
                table: "Drinks",
                column: "SelectionId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Drinks_Selections_SelectionId",
                table: "Drinks",
                column: "SelectionId",
                principalTable: "Selections",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Drinks_Selections_SelectionId1",
                table: "Drinks",
                column: "SelectionId1",
                principalTable: "Selections",
                principalColumn: "Id");
        }
    }
}
