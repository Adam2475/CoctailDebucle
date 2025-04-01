namespace CoctailDebucle.Server.Models
{
    public class CreateDrinkDto
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public int GlassId { get; set; } // Only need the foreign key
        public string Instructions { get; set; }

        public List<DrinkIngredientDto> Ingredients { get; set; }
    }

    public class DrinkIngredientDto
    {
        public int IngredientId { get; set; } // Only need the ID
        public string Amount { get; set; }
    }
}
