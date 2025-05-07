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
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  templateUrl: './cocktail-detail.component.html',
  imports: [NgIf, CommonModule, NgFor, TranslateModule, ButtonModule],
  styleUrls: ['./cocktail-detail.component.css']
})
export class CocktailDetailComponent implements OnInit
{
  cocktail: any;
  drinkId: number | null = null;
  userId: number | null = null;
  isFavorite: boolean = false;
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
    const drinkId = +this.route.snapshot.paramMap.get('id')!;
    console.log("id: ", drinkId);

    this.cocktailService.getDrinkByIdDb(drinkId).subscribe((data) => {
      this.cocktail = data;
      console.log("drink: ", this.cocktail);

      const userId = this.authService.getUserId();
      if (userId) {
        this.userService.getUserFavorites(userId).subscribe(favorites => {
          this.isFavorite = favorites.some((fav: any) => fav.id === drinkId);
          console.log("isFavorite: ", this.isFavorite);
        });
      }
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

  checkFavorite(drinkId: number) {

  }

  toggleFavorite(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const drinkId = this.cocktail.id;

    if (this.isFavorite) {
      this.userService.removeFavoriteDrink(userId, drinkId).subscribe({
        next: () => {
          this.isFavorite = false;
          this.successMessage = this.translate.instant('COCKTAIL_DETAIL.REMOVED_FROM_FAVORITES');
          setTimeout(() => this.successMessage = '', 2000);
        },
        error: err => console.error('Failed to remove from favorites', err)
      });
    } else {
      this.userService.addFavoriteDrink(userId, drinkId).subscribe({
        next: () => {
          this.isFavorite = true;
          this.successMessage = this.translate.instant('COCKTAIL_DETAIL.ADDED_TO_FAVORITES');
          setTimeout(() => this.successMessage = '', 2000);
        },
        error: err => console.error('Failed to add to favorites', err)
      });
    }
  }


  //addToFavorites(drinkId: number) {
  //  const userId = this.authService.getUserId();
  //  if (userId) {
  //    this.userService.addFavoriteDrink(userId, drinkId).subscribe({
  //      next: () => {
  //        console.log('Drink added to favorites');
  //        this.successMessage = this.translate.instant('COCKTAIL_DETAIL.ADDED_TO_FAVORITES');
  //        // Nasconde il messaggio dopo tot millisecondi
  //        setTimeout(() => this.successMessage = '', 2000);
  //      },
  //      error: err => console.error('Failed to add to favorites', err)
  //    });
  //  }
  //}

}
