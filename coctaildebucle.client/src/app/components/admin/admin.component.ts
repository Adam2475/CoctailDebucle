import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrinkCardsComponent } from '../drink-cards/drink-cards.component'
import { HttpClient } from '@angular/common/http';
import { CocktailService } from '../../services/cocktail.service';
import { Router } from '@angular/router';
import { Drink } from '../../models/drink.model';
import { Observable, Subject, forkJoin, from, of } from 'rxjs';
// lol
import { debounceTime, distinctUntilChanged, mergeMap, switchMap, concatMap, map, toArray, delay } from 'rxjs/operators';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, CardModule],
})
export class AdminComponent implements OnInit {
  drinks: any[] = []; // Array to hold drink data

  constructor(private cocktailService: CocktailService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cocktailService.getDrinks().pipe(
      map((data: any) => this.getRandomDrinks(data.drinks, 9)), // 1. Pick 9 random
      switchMap((drinks: any[]) => {
        // 2. Fetch full details for each drink
        const detailRequests = drinks.map(drink =>
          this.cocktailService.getDrinkDetails(drink.idDrink).pipe(
            map(res => res.drinks[0]) // extract full drink details
          )
        );
        return forkJoin(detailRequests);
      }),
      map((fullDrinks: any[]) => {
        // 3. Add extracted ingredients to each drink
        return fullDrinks.map(drink => ({
          ...drink,
          ingredients: this.extractIngredients(drink)
        }));
      })
    ).subscribe({
      next: (drinksWithIngredients) => {
        this.drinks = drinksWithIngredients;
        console.log("Final drink objects:", this.drinks);
      },
      error: (err) => {
        console.error("Error fetching drinks:", err);
      }
    });
  }

  private getRandomDrinks(drinks: any[], count: number): any[] {
    if (drinks.length <= count) return drinks; // Return all if less than 9

    return drinks
      .sort(() => 0.5 - Math.random()) // Shuffle array
      .slice(0, count); // Get first `count` elements
  }

  private extractIngredients(drink: any): { ingredient: string, measure: string }[] {
    const ingredients: { ingredient: string, measure: string }[] = [];

    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];

      if (ingredient) {
        console.log(`Ingredient ${i}:`, ingredient, '| Measure:', measure); // <== Add this
        ingredients.push({ ingredient, measure: measure || '' });
      }
    }

    return ingredients;
  }

}
