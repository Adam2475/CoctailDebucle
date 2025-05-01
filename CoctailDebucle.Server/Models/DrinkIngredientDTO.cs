namespace CoctailDebucle.Server.Models
{
    public class DrinkIngredientDto
    {
        public int IngredientId { get; set; }
        public string? IngredientName { get; set; }  // ✅ Add this
        public string Amount { get; set; }
    }
}
