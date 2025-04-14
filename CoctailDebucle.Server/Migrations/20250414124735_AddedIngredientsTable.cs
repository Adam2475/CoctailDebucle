using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoctailDebucle.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedIngredientsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DrinkIngredient_Drinks_DrinkId",
                table: "DrinkIngredient");

            migrationBuilder.DropForeignKey(
                name: "FK_DrinkIngredient_Ingredients_IngredientId",
                table: "DrinkIngredient");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DrinkIngredient",
                table: "DrinkIngredient");

            migrationBuilder.RenameTable(
                name: "DrinkIngredient",
                newName: "DrinkIngredients");

            migrationBuilder.RenameIndex(
                name: "IX_DrinkIngredient_IngredientId",
                table: "DrinkIngredients",
                newName: "IX_DrinkIngredients_IngredientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DrinkIngredients",
                table: "DrinkIngredients",
                columns: new[] { "DrinkId", "IngredientId" });

            migrationBuilder.AddForeignKey(
                name: "FK_DrinkIngredients_Drinks_DrinkId",
                table: "DrinkIngredients",
                column: "DrinkId",
                principalTable: "Drinks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DrinkIngredients_Ingredients_IngredientId",
                table: "DrinkIngredients",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DrinkIngredients_Drinks_DrinkId",
                table: "DrinkIngredients");

            migrationBuilder.DropForeignKey(
                name: "FK_DrinkIngredients_Ingredients_IngredientId",
                table: "DrinkIngredients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DrinkIngredients",
                table: "DrinkIngredients");

            migrationBuilder.RenameTable(
                name: "DrinkIngredients",
                newName: "DrinkIngredient");

            migrationBuilder.RenameIndex(
                name: "IX_DrinkIngredients_IngredientId",
                table: "DrinkIngredient",
                newName: "IX_DrinkIngredient_IngredientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DrinkIngredient",
                table: "DrinkIngredient",
                columns: new[] { "DrinkId", "IngredientId" });

            migrationBuilder.AddForeignKey(
                name: "FK_DrinkIngredient_Drinks_DrinkId",
                table: "DrinkIngredient",
                column: "DrinkId",
                principalTable: "Drinks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DrinkIngredient_Ingredients_IngredientId",
                table: "DrinkIngredient",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
