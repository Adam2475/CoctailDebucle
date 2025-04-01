namespace CoctailDebucle.Server.Models
{
    public class UserFavoriteDrink
    {
        public int UserId { get; set; }
        public User User { get; set; }

        public int DrinkId { get; set; }
        public Drink Drink { get; set; }
    }
}
