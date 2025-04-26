using System.ComponentModel.DataAnnotations;

namespace CoctailDebucle.Server.DTOs
{
    public class UpdateUserDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public String Password { get; set; }

        //public bool GdprConsent { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Surname { get; set; }

        [DataType(DataType.Date)]
        public DateTime BirthDate { get; set; }
    }

}
