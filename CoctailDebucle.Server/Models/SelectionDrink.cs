namespace CoctailDebucle.Server.Models
{
    public class SelectionDrink
    {
        public int SelectionId { get; set; }
        public Selection Selection { get; set; }

        public int DrinkId { get; set; }
        public Drink Drink { get; set; }
    }
}
