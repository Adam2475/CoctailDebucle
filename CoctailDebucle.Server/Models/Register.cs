using System.ComponentModel.DataAnnotations;

namespace CoctailDebucle.Server.Models
{
    public class RegisterModel
    {
        [Required]
        //[MinLength(4)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        //[MinLength(6)]
        public string Password { get; set; }
    }
}
