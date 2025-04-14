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

        // Update for profiling
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }

        [DataType(DataType.Date)]
        public DateTime BirthDate { get; set; }
    }
}
