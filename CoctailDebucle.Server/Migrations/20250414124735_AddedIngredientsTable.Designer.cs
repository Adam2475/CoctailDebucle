﻿// <auto-generated />
using System;
using CoctailDebucle.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CoctailDebucle.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250414124735_AddedIngredientsTable")]
    partial class AddedIngredientsTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
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

                    b.Property<string>("ImagePath")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Instructions")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("GlassId");

                    b.HasIndex("UserId");

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

                    b.ToTable("DrinkIngredients");
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

                    b.Property<DateTime>("BirthDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<bool>("GdprConsent")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

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

                    b.HasOne("CoctailDebucle.Server.Models.User", "User")
                        .WithMany("Drinks")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Glass");

                    b.Navigation("User");
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
                    b.Navigation("Drinks");

                    b.Navigation("FavoriteDrinks");
                });
#pragma warning restore 612, 618
        }
    }
}
