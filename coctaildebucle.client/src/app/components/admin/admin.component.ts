import { Component } from '@angular/core';
import { DrinkCardsComponent } from '../drink-cards/drink-cards.component'
import { HttpClient } from '@angular/common/http';
import { CocktailService } from '../../services/cocktail.service';
import { Router } from '@angular/router';
import { Drink } from '../../models/drink.model';
import { Observable, Subject, forkJoin, from, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap, switchMap, concatMap, map, toArray, delay } from 'rxjs/operators';


@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  searchQuery: string = '';
  drinks: any[] = [];
  categories: string[] = [];
  ingredients: string[] = [];
  glasses: string[] = [];
  selectedCategory: string = '';
  selectedIngredient: string = '';
  selectedGlass: string = '';
  isLoggedIn: boolean = false;
  //new admin
  selectedIngredients: string[] = [];
  previewDrinks: Drink[] = [];
  selectedDrinks: string[] = [];


  constructor(private http: HttpClient, private cocktailService: CocktailService, private router: Router) { }

  ngOnInit() {
    this.checkLogin();
    //this.loadCategories();
    this.loadIngredients();
    //this.loadGlasses();

    // Ripristina stato da sessionStorage
    const storedIngredients = sessionStorage.getItem('adminSelectedIngredients');
    const storedDrinks = sessionStorage.getItem('adminPreviewDrinks');

    if (storedIngredients) {
      this.selectedIngredients = JSON.parse(storedIngredients);
    }

    if (storedDrinks) {
      this.previewDrinks = JSON.parse(storedDrinks);
    }
  }

  checkLogin() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    // Optionally, navigate to the login or home page.
  }

  // Navigate to the user's personal page.
  navigateToProfile() {
    // e.g., using the router to navigate to '/profile'
    this.router.navigate(['/profile']);
  }

  searchDrinks(query: string): Observable<any> {
    const url = `https://yourapi.com/api/cocktail?name=${query}`;
    return this.http.get<any>(url);
  }

  loadIngredients() {
    this.cocktailService.getIngredients().subscribe(response => {
      this.ingredients = response.drinks
        .map((i: any) => i.strIngredient1)
        .sort(); // Ordina alfabeticamente
    });
  }

  //con barra di ricerca questo diventa inutile, togli
  toggleIngredient(ingredient: string) {
    const index = this.selectedIngredients.indexOf(ingredient);
    if (index === -1) {
      this.selectedIngredients.push(ingredient);
    } else {
      this.selectedIngredients.splice(index, 1);
    }
  }


  /* questo cambia completamente:
    ci sarà una barra di ricerca per gli ingredienti
    e tali ingredienti saranno in local storage
    probabilmente all'avvio il local storage prenderà tali ingredienti dal database interno
    che sarà stato popolato in fase di sviluppo prendendo dall'api
  */
  fetchPreview() {
    if (this.selectedIngredients.length < 2) {
      alert("Seleziona almeno due ingredienti per vedere i cocktail disponibili.");
      this.previewDrinks = [];
      return;
    }

    this.cocktailService.searchCocktails('', '', this.selectedIngredients.join(','), '')
      .pipe(
        switchMap(response => {
          const results = response.drinks || [];
          console.log("Risposta completa del servizio:", response);
          console.log("Numero di drink trovati (basic):", results.length);

          if (!Array.isArray(results) || results.length === 0) {
            this.previewDrinks = [];
            return of([]);
          }

          // Limitiamo il numero di risultati, ad esempio ai primi 50
          const limitedResults = results.slice(0, 70);

          // Per ogni drink basilare, otteniamo i dettagli in maniera sequenziale (concatMap)
          return from(limitedResults).pipe(
            concatMap(drink =>
              this.cocktailService.getDrinkById(drink.idDrink).pipe(
                delay(50), // ritardo di 200ms tra le richieste (modifica il valore in base al rate limit)
                map((res: any) => res.drinks[0])
              )
            ),
            toArray()
          );
        }),
        map((detailedDrinks: any[]) => {
          // Funzione helper per ottenere gli ingredienti di un drink
          const getDrinkIngredients = (drink: any): string[] => {
            const ingArray: string[] = [];
            for (let i = 1; i <= 15; i++) {
              const ing = drink[`strIngredient${i}`];
              if (ing) ingArray.push(ing.trim());
            }
            return ingArray;
          };

          // Filtro: il drink è valido se tutti gli ingredienti selezionati sono presenti nel drink
          const filtered = detailedDrinks.filter(drink => {
            const drinkIngredients = getDrinkIngredients(drink);
            return this.selectedIngredients.every(sel => drinkIngredients.includes(sel));
          });

          return filtered;
        })
      )
      .subscribe(filteredDrinks => {
        console.log("Numero di drink dopo filtro:", filteredDrinks.length);
        this.previewDrinks = filteredDrinks;
        this.selectedDrinks = [];
        sessionStorage.setItem('adminSelectedIngredients', JSON.stringify(this.selectedIngredients));
        sessionStorage.setItem('adminPreviewDrinks', JSON.stringify(this.previewDrinks));
      }, error => {
        console.error("Errore ottenendo i dettagli dei drink:", error);
      });
  }

  toggleDrinkSelection(id: string) {
    const index = this.selectedDrinks.indexOf(id);
    if (index === -1) {
      this.selectedDrinks.push(id);
    } else {
      this.selectedDrinks = this.selectedDrinks.filter(d => d !== id);
    }
  }

  removeSelected() {
    this.previewDrinks = this.previewDrinks.filter(drink => !this.selectedDrinks.includes(drink.idDrink));
    this.selectedDrinks = [];
  }

  selectAll() {
    this.selectedDrinks = this.previewDrinks.map(d => d.idDrink);
  }

  publishMenu() {
    // TO DO: chiamata POST al backend
    console.log("Drink da pubblicare:", this.previewDrinks);
  }

}
