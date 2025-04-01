﻿// <auto-generated />
using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CoctailDebucle.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CoctailDebucle.Server.Models.Drink", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("GlassId")
                        .HasColumnType("int");

                    b.Property<string>("Instructions")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("GlassId");

                    b.ToTable("Drinks");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.DrinkIngredient", b =>
                {
                    b.Property<int>("DrinkId")
                        .HasColumnType("int");

                    b.Property<int>("IngredientId")
                        .HasColumnType("int");

                    b.Property<string>("Amount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("DrinkId", "IngredientId");

                    b.HasIndex("IngredientId");

                    b.ToTable("DrinkIngredient");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.Glass", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Glasses");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.Ingredient", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("IngredientName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Ingredients");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.UserFavoriteDrink", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("DrinkId")
                        .HasColumnType("int");

                    b.HasKey("UserId", "DrinkId");

                    b.HasIndex("DrinkId");

                    b.ToTable("UserFavoriteDrinks");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.Drink", b =>
                {
                    b.HasOne("CoctailDebucle.Server.Models.Glass", "Glass")
                        .WithMany("Drinks")
                        .HasForeignKey("GlassId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Glass");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.DrinkIngredient", b =>
                {
                    b.HasOne("CoctailDebucle.Server.Models.Drink", "Drink")
                        .WithMany("DrinkIngredients")
                        .HasForeignKey("DrinkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CoctailDebucle.Server.Models.Ingredient", "Ingredient")
                        .WithMany("DrinkIngredients")
                        .HasForeignKey("IngredientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Drink");

                    b.Navigation("Ingredient");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.UserFavoriteDrink", b =>
                {
                    b.HasOne("CoctailDebucle.Server.Models.Drink", "Drink")
                        .WithMany("FavoritedByUsers")
                        .HasForeignKey("DrinkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CoctailDebucle.Server.Models.User", "User")
                        .WithMany("FavoriteDrinks")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Drink");

                    b.Navigation("User");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.Drink", b =>
                {
                    b.Navigation("DrinkIngredients");

                    b.Navigation("FavoritedByUsers");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.Glass", b =>
                {
                    b.Navigation("Drinks");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.Ingredient", b =>
                {
                    b.Navigation("DrinkIngredients");
                });

            modelBuilder.Entity("CoctailDebucle.Server.Models.User", b =>
                {
                    b.Navigation("FavoriteDrinks");
                });
#pragma warning restore 612, 618
        }
    }
}
