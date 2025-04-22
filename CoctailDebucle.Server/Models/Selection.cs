using System.ComponentModel.DataAnnotations;

namespace CoctailDebucle.Server.Models
{
    public class Selection
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }  // Navigation property

        [DataType(DataType.Date)]
        public DateTime CreationDate { get; set; }

        public bool isActive { get; set; } 

        public List<Drink> Drinks { get; set; } = new List<Drink>();
    }
}