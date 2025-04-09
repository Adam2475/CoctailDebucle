using System.ComponentModel.DataAnnotations;

namespace CoctailDebucle.Server.Models
{
    public class CreateDrinkDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Category { get; set; }
        [Required]
        public int GlassId { get; set; }
        [Required]
        public string Instructions { get; set; }
        //public string IngredientsJson { get; set; } /// serialized from Angular
        //public List<IngredientDTO> Ingredients { get; set; }
        // Accept a JSON string for ingredients
        [Required]
        public string Ingredients { get; set; }
        public IFormFile? Image { get; set; }  // the uploaded image
    }
}