using CoctailDebucle.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CoctailDebucle.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Drink> Drinks { get; set; }
        public DbSet<Glass> Glasses { get; set; } // Add Glass entity
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<UserFavoriteDrink> UserFavoriteDrinks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            // Define many-to-many relationship between Drinks and Ingredients
            modelBuilder.Entity<DrinkIngredient>()
                .HasKey(di => new { di.DrinkId, di.IngredientId });

            modelBuilder.Entity<DrinkIngredient>()
                .HasOne(di => di.Drink)
                .WithMany(d => d.DrinkIngredients)
                .HasForeignKey(di => di.DrinkId);

            modelBuilder.Entity<DrinkIngredient>()
                .HasOne(di => di.Ingredient)
                .WithMany(i => i.DrinkIngredients)
                .HasForeignKey(di => di.IngredientId);
       
            modelBuilder.Entity<UserFavoriteDrink>()
                .HasKey(ufd => new { ufd.UserId, ufd.DrinkId });

            modelBuilder.Entity<UserFavoriteDrink>()
                    .HasOne(ufd => ufd.User)
                    .WithMany(u => u.FavoriteDrinks)
                    .HasForeignKey(ufd => ufd.UserId);

            modelBuilder.Entity<UserFavoriteDrink>()
                    .HasOne(ufd => ufd.Drink)
                    .WithMany(d => d.FavoritedByUsers)
                    .HasForeignKey(ufd => ufd.DrinkId);
        }
    }
}
