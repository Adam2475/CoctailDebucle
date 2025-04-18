﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoctailDebucle.Server.Models
{
    public class Drink
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Category { get; set; }

        // Foreign Key for Glass
        public int GlassId { get; set; }

        //[ForeignKey("GlassId")]
        public Glass Glass { get; set; } // Navigation property for Glass
        public string Instructions { get; set; }
        public List<DrinkIngredient> DrinkIngredients { get; set; }
        // Many-to-Many: A drink can be favorited by multiple users
        public List<UserFavoriteDrink> FavoritedByUsers { get; set; } = new();

        // One-to-Many: Multiple drinks can be created by a single user
        public int UserId { get; set; }        // foreign key
        public User User { get; set; }         // navigation property

        // Path for the Db stored image
        public string? ImagePath { get; set; }
    }
}
