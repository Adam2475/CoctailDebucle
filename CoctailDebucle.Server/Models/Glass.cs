using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CoctailDebucle.Server.Models
{
    public class Glass
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } // Example: "Cocktail Glass", "Martini Glass"

        // Navigation property - One Glass can be used for many Drinks
        [JsonIgnore]
        public ICollection<Drink> Drinks { get; set; } = new List<Drink>();
    }
}