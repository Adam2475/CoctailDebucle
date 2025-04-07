using System.ComponentModel.DataAnnotations;
using CoctailDebucle.Server.Models;

// User Model
namespace CoctailDebucle.Server.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Username { get; set; }

        public bool GdprConsent { get; set; }

        [Required, MaxLength(255)]
        public string PasswordHash { get; set; }

        [Required, MaxLength(100)]
        public string Email { get; set; }
        // Many-to-Many: A user can have multiple favorite drinks
        public List<UserFavoriteDrink> FavoriteDrinks { get; set; } = new();

        [Required]
        public UserRole Role { get; set; } = UserRole.User; // default to regular user
    }
}

