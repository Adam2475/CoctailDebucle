import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CocktailService } from '../../services/cocktail.service';
import { NgIf, NgFor } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  templateUrl: './cocktail-detail.component.html',
  imports: [NgIf, CommonModule, NgFor, TranslateModule],
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
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    // Get the 'id' parameter from the route
    const drinkId = +this.route.snapshot.paramMap.get('id')!;

    const stringId: string = drinkId.toString();

    // Call the service to fetch the drink by its ID
    console.log("id: ",drinkId.toString());
    this.cocktailService.getDrinkByIdDb(drinkId).subscribe((data) => {
      this.cocktail = data;
      console.log("drink: ",this.cocktail);
    });
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

  addToFavorites(drinkId: number) {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.addFavoriteDrink(userId, drinkId).subscribe({
        next: () => {
          console.log('Drink added to favorites');
          this.successMessage = this.translate.instant('COCKTAIL_DETAIL.ADDED_TO_FAVORITES');
          // Nasconde il messaggio dopo tot millisecondi
          setTimeout(() => this.successMessage = '', 2000);
        },
        error: err => console.error('Failed to add to favorites', err)
      });
    }
  }

}
