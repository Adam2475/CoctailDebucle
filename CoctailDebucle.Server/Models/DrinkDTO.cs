namespace CoctailDebucle.Server.Models
{
    public class DrinkDTO
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public int GlassId { get; set; } // Only need the foreign key
        public string Instructions { get; set; }

        public List<DrinkIngredientDto> Ingredients { get; set; }

        public int UserId { get; set; }

        public string? ImagePath { get; set; } // the uploaded image

        public bool IsCreatedByUser { get; set; }

        public byte[]? ImageData { get; set; }
        public string? ImageMimeType { get; set; } // es. "image/jpeg", "image/png"
    }

    public class DrinkIngredientDto
    {
        public int IngredientId { get; set; } // Only need the ID
        public string Amount { get; set; }
    }
}