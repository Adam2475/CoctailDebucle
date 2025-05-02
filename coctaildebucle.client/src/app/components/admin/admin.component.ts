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
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from '../../services/language.service';



async function encodeImageFileAsURL(image: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result as string);  // Result will be a base64 string
    }
    reader.onerror = reject;
    reader.readAsDataURL(image); // Converts image to base64 string
  });
}

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
  imports: [
    CommonModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
})
export class AdminComponent implements OnInit {
  drinks: any[] = [];
  selectionList: any[] = [];
  selectedSelection: any = null;
  //multi-parameter searchbar
  searchQuery: string = '';
  categories: string[] = [];
  ingredients: string[] = [];
  glasses: string[] = [];
  selectedCategory: string = '';
  selectedIngredient: string = '';
  selectedGlass: string = '';
  searchForm!: FormGroup;
  isRandomSelection: boolean = true;
  searchUsed: boolean = false;
  noSearchResults: boolean = false;
    //multi-parameter searchbar

  constructor(
    private cocktailService: CocktailService,
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder
   ) { }

  ngOnInit(): void {
    this.fetchSelectionList();
    this.loadRandomDrinks();
    this.loadCategories();
    this.loadIngredients();
    this.loadGlasses();
    this.searchForm = this.fb.group({
      query: [''],
      category: [''],
      ingredient: [''],
      glass: ['']
    });

    this.searchForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    ).subscribe(values => {
      this.performSearch(values);
    });

  }

  fetchSelectionList()
  {
    this.cocktailService.getSelections().subscribe((data: any[]) => {
      console.log("Selections fetched from API:", data);
      this.selectionList = data;
    });
  }


  toggleSelectionList(id: number)
  {
  this.http.put<any>(`https://localhost:7047/api/selection/toggle-selection-list/${id}`, {})
    .subscribe({
      next: (response) => {
        const updated = this.selectionList.find(s => s.id === id);
        if (updated) {
          updated.isActive = response.isActive;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
}

  onSelectionChange(selectionId: number)
  {
    this.selectedSelection = this.selectionList.find(s => s.id === +selectionId);
  }

  removeSelection(id: number)
  {
    // Call the API to delete the selection
    this.http.delete(`https://localhost:7047/api/selection/${id}`).subscribe({
      next: (response) => {
        // If the selection was successfully deleted, remove it from the local list
        this.selectionList = this.selectionList.filter(s => s.id !== id);
      },
      error: (err) => {
        console.error('Error deleting selection:', err);
      }
    });
  }

  //////////////////////////////////
  // Selection List Methods
  //////////////////////////////////

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
   *          
   */

  submitSelection(): void {
    const uniqueIngredients = new Set<string>();
    const uniqueGlasses = new Set<string>();

    this.selectedDrinks.forEach(drink => {
      if (drink.strGlass) uniqueGlasses.add(drink.strGlass);
      if (drink.ingredients) {
        drink.ingredients.forEach((ing: any) => {
          if (ing.ingredient) uniqueIngredients.add(ing.ingredient);
        });
      }
    });

    const ingredientsArray = Array.from(uniqueIngredients).map(name => ({ name }));
    const glassesArray = Array.from(uniqueGlasses).map(name => ({ name }));

    this.cocktailService.saveIngredients(ingredientsArray).pipe(
      switchMap(() => this.cocktailService.saveGlasses(glassesArray)),
      switchMap(() => this.authService.getUser()),
      map(user => user?.id),
      switchMap(userId =>
        forkJoin({
          ingredients: this.cocktailService.getAllIngredients(),
          glasses: this.cocktailService.getAllGlasses()
        }).pipe(
          map(({ ingredients, glasses }) => ({ userId, ingredients, glasses }))
        )
      )
    ).subscribe(async ({ userId, ingredients, glasses }) => {
      try {
        const drinksPayload = await Promise.all(
          this.selectedDrinks.map(async drink => {
            const matchedGlass = glasses.find(g => g.name === drink.strGlass);
            const mappedIngredients = drink.ingredients
              .map((ing: any) => {
                const matchedIng = ingredients.find((dbIng: any) =>
                  dbIng.name.trim().toLowerCase() === ing.ingredient.trim().toLowerCase()
                );
                if (!matchedIng) return null;
                return {
                  ingredientId: matchedIng.id,
                  amount: ing.measure || ''
                };
              })
              .filter((ing: any) => ing !== null);

            let imageData = '';
            let mimeType = '';

            try {
              const imageResult = await this.convertImageUrlToBase64(drink.strDrinkThumb);
              imageData = imageResult.base64;
              mimeType = imageResult.mimeType;
            } catch (e) {
              console.error(`Error converting image for ${drink.strDrink}`, e);
            }

            return {
              name: drink.strDrink,
              category: drink.strCategory || 'Unknown',
              glassId: matchedGlass ? matchedGlass.id : 1,
              instructions: drink.strInstructions,
              ingredients: mappedIngredients,
              userId: Number(userId),
              imagePath: drink.strDrinkThumb || null,
              imageData,
              imageMimeType: mimeType
            };
          })
        );

        // Submit all drinks
        forkJoin(
          drinksPayload.map(payload =>
            this.http.post<{ id: number, duplicate: boolean }>('https://localhost:7047/api/drinkDb/savedrink', payload)
          )
        ).subscribe({
          next: (responses) => {
            const nonDuplicateDrinkIds = responses
              .filter(res => !res.duplicate)
              .map(res => res.id);

            if (nonDuplicateDrinkIds.length === 0) {
              console.log('All drinks were duplicates, skipping selection creation.');
              return;
            }

            // Adding duplicate id's to the selection
            const allDrinkIds = responses.map(res => res.id);

            const selectionPayload = {
              userId: Number(userId),
              drinkIds: allDrinkIds
            };

            this.http.post('https://localhost:7047/api/selection/add-selection', selectionPayload)
              .subscribe({
                next: res => {
                  window.location.reload();
                },
                error: err => console.error('Selection save error:', err)
              });
          },
          error: err => console.error('Error submitting drinks:', err)
        });

      } catch (error) {
        console.error('Error building drink payloads:', error);
      }
    });
  }

  async convertImageToBlob(imageUrl: string): Promise<Blob | undefined>
  {
    if (!imageUrl) return undefined;

    return new Observable<Blob>((observer) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', imageUrl, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        observer.next(xhr.response);
        observer.complete();
      };
      xhr.onerror = (err) => {
        observer.error(err);
      };
      xhr.send();
    }).toPromise();
  }

  convertImageUrlToBase64(url: string): Promise<{ base64: string, mimeType: string }>
  {
    return fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch image');
        const mimeType = response.headers.get("Content-Type") || 'image/jpeg';
        return response.blob().then(blob => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = (reader.result as string).split(',')[1];
              resolve({ base64, mimeType });
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        });
      });
  }

  /**
   *  @brief : add and remove a drink from the selection
   *  @param drink
   */

  toggleSelection(drink: any): void
  {
    const index = this.selectedDrinks.findIndex(d => d.idDrink === drink.idDrink);
    console.log("ciaone");
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


  onSelectionChange2(value: string) {
    const id = Number(value);
    this.selectedSelection = this.selectionList.find(s => s.id === id);
  }

  //////////////////////////////
  // SearchBar Methods
  //////////////////////////////

  /**
  * @brief : da compilare
  *
  * 
  *          
  */

  loadCategories() {
    this.cocktailService.getCategories().subscribe(response => {
      this.categories = response.drinks.map((c: any) => c.strCategory).sort();
    });
  }

  loadIngredients() {
    this.cocktailService.getIngredients().subscribe(response => {
      this.ingredients = response.drinks.map((i: any) => i.strIngredient1).sort();
    });
  }

  loadGlasses() {
    this.cocktailService.getGlasses().subscribe(response => {
      this.glasses = response.drinks.map((g: any) => g.strGlass).sort();
    });
  }

  performSearch(values: any): void {
    const { query, category, ingredient, glass } = values;

    const hasFilters = query.trim() || category || ingredient || glass;
    this.searchUsed = hasFilters;

    if (!hasFilters) {
      this.loadRandomDrinks(); // <-- già esistente
      return;
    }

    this.cocktailService.searchCocktails(query, category, ingredient, glass).pipe(
      map(response => response.drinks || []),
      switchMap((drinks: any[]) => {
        if (!drinks.length) {
          this.noSearchResults = true;
          this.drinks = [];
          return of([]); // Stop pipeline early
        }

        this.noSearchResults = false;
        const detailRequests = drinks.map(drink =>
          this.cocktailService.getDrinkDetails(drink.idDrink).pipe(
            map(res => res.drinks[0])
          )
        );
        return forkJoin(detailRequests);
      }),
      map((fullDrinks: any[]) => {
        return fullDrinks.map(drink => ({
          ...drink,
          ingredients: this.extractIngredients(drink)
        }));
      })
    ).subscribe({
      next: (drinksWithIngredients) => {
        this.isRandomSelection = false;
        if (drinksWithIngredients.length === 0) return;
        this.drinks = drinksWithIngredients;
      },
      error: (err) => {
        console.error("Error fetching searched drinks:", err);
      }
    });
  }

  /* performSearch() >>> onSearch()*/
  //onSearch(): void {
  //  if (
  //    this.searchQuery.trim() ||
  //    this.selectedCategory ||
  //    this.selectedIngredient ||
  //    this.selectedGlass
  //  ) {
  //    this.cocktailService.searchCocktails(
  //      this.searchQuery,
  //      this.selectedCategory,
  //      this.selectedIngredient,
  //      this.selectedGlass
  //    ).pipe(
  //      map(response => response.drinks || []),
  //      switchMap((drinks: any[]) => {
  //        const detailRequests = drinks.map(drink =>
  //          this.cocktailService.getDrinkDetails(drink.idDrink).pipe(
  //            map(res => res.drinks[0])
  //          )
  //        );
  //        return forkJoin(detailRequests);
  //      }),
  //      map((fullDrinks: any[]) => {
  //        return fullDrinks.map(drink => ({
  //          ...drink,
  //          ingredients: this.extractIngredients(drink)
  //        }));
  //      })
  //    ).subscribe({
  //      next: (drinksWithIngredients) => {
  //        this.drinks = drinksWithIngredients;
  //      },
  //      error: (err) => {
  //        console.error("Error fetching searched drinks:", err);
  //      }
  //    });
  //  } else {
  //    this.loadRandomDrinks(); // fallback
  //  }
  //}

  /*logic to make random selection moved here from onInit*/
  loadRandomDrinks(): void {
    this.isRandomSelection = true;
    this.noSearchResults = false;
    this.cocktailService.getDrinks().pipe(
      map((data: any) => this.getRandomDrinks(data.drinks, 9)),
      switchMap((drinks: any[]) => {
        const detailRequests = drinks.map(drink =>
          this.cocktailService.getDrinkDetails(drink.idDrink).pipe(
            map(res => res.drinks[0])
          )
        );
        return forkJoin(detailRequests);
      }),
      map((fullDrinks: any[]) => {
        return fullDrinks.map(drink => ({
          ...drink,
          ingredients: this.extractIngredients(drink)
        }));
      })
    ).subscribe({
      next: (drinksWithIngredients) => {
        this.drinks = drinksWithIngredients;
      },
      error: (err) => {
        console.error("Error fetching drinks:", err);
      }
    });
  }

}
