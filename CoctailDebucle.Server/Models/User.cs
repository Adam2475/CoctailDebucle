using System.ComponentModel.DataAnnotations;
using CoctailDebucle.Server.Models;

// Setting up Database context
namespace CoctailDebucle.Server.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Username { get; set; }

        public bool GdprConsent { get; set; } // ✅ Store GDPR consent

        [Required, MaxLength(255)]
        public string PasswordHash { get; set; }

        [Required, MaxLength(100)]
        public string Email { get; set; }
        // Many-to-Many: A user can have multiple favorite drinks
        public List<UserFavoriteDrink> FavoriteDrinks { get; set; } = new();
    }
}

//public class Drink
//{
//    public int DrinkID { get; set; }
//    public string Name { get; set; }
//    public ICollection<User> FavoritedByUsers { get; set; }
//    public object Ingredients { get; set; }
//}
