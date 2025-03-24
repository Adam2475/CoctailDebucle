using System.ComponentModel.DataAnnotations;

// Setting up Database context
namespace CoctailDebucle.Server
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Username { get; set; }

        [Required, MaxLength(255)]
        public string PasswordHash { get; set; }

        [Required, MaxLength(100)]
        public string Email { get; set; }
    }
}
