﻿using System.Reflection;
using CoctailDebucle.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CoctailDebucle.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        /** Maps a specific table es: [User] to a class 
         *  - the class contains specific methods to perform query logic
         *  es:_context.Users.ToListAsync() = SELECT * FROM Users
         */
        public DbSet<User> Users { get; set; }
        public DbSet<Drink> Drinks { get; set; }
        public DbSet<Glass> Glasses { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<UserFavoriteDrink> UserFavoriteDrinks { get; set; }
        public DbSet<DrinkIngredient> DrinkIngredients { get; set; }

        public DbSet<Selection> Selections { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

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

            modelBuilder.Entity<Drink>()
                    .HasOne(d => d.User)
                    .WithMany(u => u.Drinks)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict);  // This avoids the cascade issue

            modelBuilder.Entity<Drink>()
                    .HasIndex(d => d.Name)
                    .IsUnique();

            modelBuilder.Entity<SelectionDrink>()
                     .HasKey(sd => new { sd.SelectionId, sd.DrinkId });

            modelBuilder.Entity<SelectionDrink>()
                    .HasOne(sd => sd.Selection)
                    .WithMany(s => s.SelectionDrinks)
                    .HasForeignKey(sd => sd.SelectionId);

            modelBuilder.Entity<SelectionDrink>()
                    .HasOne(sd => sd.Drink)
                    .WithMany(d => d.SelectionDrinks)
                    .HasForeignKey(sd => sd.DrinkId);
        }
    }
}
