import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrinkCardsComponent } from '../drink-cards/drink-cards.component'
import { HttpClient } from '@angular/common/http';
import { CocktailService } from '../../services/cocktail.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Drink } from '../../models/drink.model';
import { Observable, Subject, forkJoin, from, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap, switchMap, concatMap, map, toArray, delay } from 'rxjs/operators';
import { CardModule } from 'primeng/card';

interface SavedDrinkResponse {
  id: number;
  name: string;
  message: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, CardModule],
})
export class AdminComponent implements OnInit {
  drinks: any[] = []; // Array to hold drink data

  constructor(private cocktailService: CocktailService, private authService: AuthService, private http: HttpClient) { }

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
       // console.log("Final drink objects:", this.drinks);
      },
      error: (err) => {
        console.error("Error fetching drinks:", err);
      }
    });
  }

  private getRandomDrinks(drinks: any[], count: number): any[]
  {
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
        //console.log(`Ingredient ${i}:`, ingredient, '| Measure:', measure); // <== Add this
        ingredients.push({ ingredient, measure: measure || '' });
      }
    }
    //console.log(ingredients);
    return ingredients;
  }

  //////////////////////////////
  // Drink Selection Methods
  //////////////////////////////

  selectedDrinks: any[] = [];

  /**
   * @brief : 1) extract the glasses and ingredients from selection
   *          2) pre-save extracted elements to our DB
   *          3) fetches the full list to estabilish correspondecies
   *          4) generate the payload to save the drink
   *
   * @todo :  split the function
   *          add images
   */

  submitSelection(): void
  {
    const uniqueIngredients = new Set<string>();
    const uniqueGlasses = new Set<string>();

    this.selectedDrinks.forEach(drink => {
      if (drink.strGlass) {
        uniqueGlasses.add(drink.strGlass);
      }

      if (drink.ingredients)
      {
        drink.ingredients.forEach((ing: any) => {
          if (ing.ingredient)
          {
            uniqueIngredients.add(ing.ingredient);
          }
        });
      }
    });

    const ingredientsArray = Array.from(uniqueIngredients).map(name => ({ name }));
    const glassesArray = Array.from(uniqueGlasses).map(name => ({ name }));

    console.log(ingredientsArray);

    // Save new ingredients and glasses
    this.cocktailService.saveIngredients(ingredientsArray).subscribe();
    this.cocktailService.saveGlasses(glassesArray).subscribe();

    // Now get user ID and required data
    this.authService.getUser().pipe(
      map(user => user?.id),
      switchMap(userId =>
        forkJoin({
          ingredients: this.cocktailService.getAllIngredients(),
          glasses: this.cocktailService.getAllGlasses()
        }).pipe(
          map(({ ingredients, glasses }) => ({ userId, ingredients, glasses }))
        )
      )
    ).subscribe(({ userId, ingredients, glasses }) => {
      const drinksPayload = this.selectedDrinks.map(drink => {
        const matchedGlass = glasses.find(g => g.name === drink.strGlass);
       // console.log("all ingredients: ", ingredients);
        const mappedIngredients = drink.ingredients
          .map((ing: any) => {
          /*  console.log('Checking ingredient from drink:', ing.ingredient);*/
            const matchedIng = ingredients.find((dbIng: any) => {
              //console.log('Checking dbIng:', dbIng);
              //console.log('Comparing:', dbIng?.name?.trim(), 'with', ing.ingredient.trim());
              //console.log('Checking dbIng:', dbIng.name);
              return dbIng.name.trim().toLowerCase() === ing.ingredient.trim().toLowerCase();
            });
            if (!matchedIng) return null;
            return {
              ingredientId: matchedIng.id,
              amount: ing.measure || ''
            };
          })
          .filter((ing: any) => ing !== null);
        //console.log(mappedIngredients);
        console.log(drink);
        return {
          name: drink.strDrink,
          category: drink.strCategory || 'Unknown',
          glassId: matchedGlass ? matchedGlass.id : 1,
          instructions: drink.strInstructions,
          ingredients: mappedIngredients,
          userId: Number(userId),
          imagePath: drink.strDrinkThumb || null
        };
      });

      forkJoin(
        drinksPayload.map(payload =>
          this.http.post('https://localhost:7047/api/drinkDb/savedrink', payload)
        )
      ).subscribe({
        next: () => console.log('All drinks submitted!'),
        error: err => console.error('Submission error:', err)
      });
    });
  }

  /**
   * @brief : add and remove a drink from the selection
   * @param drink
   */

  toggleSelection(drink: any): void
  {
    const index = this.selectedDrinks.findIndex(d => d.idDrink === drink.idDrink);

    if (index !== -1)
      this.selectedDrinks.splice(index, 1);
    else
    {
      const ingredients: any[] = [];

      // Loop over the 15 ingredient fields from the drink API
      for (let i = 1; i <= 15; i++)
      {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '')
        {
          ingredients.push({
            ingredient: ingredient.trim(),
            measure: measure?.trim() || ''
          });
        }
      }
      // Pushes the new object to selectedDrinks
      this.selectedDrinks.push({
        ...drink,
        ingredients
      });
    }
  }

  /**
   * 
   * @param drink
   * @returns
   *
   * @note : some() : loop trough array after using the callback function
   *                  that returns true or false for each element
   */

  isSelected(drink: any): boolean
  {
    return this.selectedDrinks.some(d => d.idDrink === drink.idDrink);
  }
}
