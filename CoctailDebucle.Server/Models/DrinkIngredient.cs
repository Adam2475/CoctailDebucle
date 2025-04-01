using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoctailDebucle.Server.Models
{
    public class DrinkIngredient
    {
        public int DrinkId { get; set; }
        public Drink Drink { get; set; }

        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }

        public string Amount { get; set; } // Example: "1 1/2 oz"
    }
}
