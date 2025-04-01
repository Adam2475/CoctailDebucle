using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoctailDebucle.Server.Models
{
    // changing to many-to-many schema
    public class Ingredient
    {
        [Key]
        public int Id { get; set; }

        public string IngredientName { get; set; }
        //public string Amount { get; set; } // es: "1 1/2 oz"

        //[ForeignKey("DrinkId")]
        public List<DrinkIngredient> DrinkIngredients { get; set; }
    }
}
