import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CocktailService } from '../../services/cocktail.service';
import { NgIf, NgFor } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  templateUrl: './cocktail-detail.component.html',
  imports: [NgIf, NgFor],
  styleUrls: ['./cocktail-detail.component.css']
})
export class CocktailDetailComponent implements OnInit
{
  cocktail: any;
  drinkId: number | null = null;
  userId: number | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private cocktailService: CocktailService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void
  {
    const id = this.route.snapshot.paramMap.get('id'); // Get ID from URL
    console.log("Cocktail ID from route:", id);

    if (id) {
      this.cocktailService.getDrinkById(id).subscribe(
        (data: any) => {
          console.log("API Response:", data); // Log the full response

          // Check if data.drinks exists and is an array
          if (Array.isArray(data.drinks) && data.drinks.length > 0) {
            this.cocktail = data.drinks[0];
            console.log("Assigned cocktail:", this.cocktail);  // Log the cocktail object
          } else {
            console.error("❌ No cocktail found for ID:", id);
            this.cocktail = null; // Set to null if no valid data found
          }
        },
        (error: any) => {
          console.error("❌ Error fetching drink details:", error);
        }
      );
    }
  }

  getIngredients(): string[]
  {
    let ingredients: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = this.cocktail[`strIngredient${i}`]; // Changed from `this.drink`
      const measure = this.cocktail[`strMeasure${i}`]; // Changed from `this.drink`
      if (ingredient) {
        ingredients.push(measure ? `${measure} ${ingredient}` : ingredient);
      }
    }
    return ingredients;
  }

  goBack(): void
  {
    window.history.back(); // Navigate back
  }

  addToFavorites()
  {
    console.log("drink info: ", this.cocktail);
    //const apiDrink = this.cocktail;

    //const dto = {

    //}
  }
}
