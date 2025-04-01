import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Drink } from '../models/drink.model';


@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1';

  constructor(private http: HttpClient) { }

  getCocktailByName(name: string): Observable<{ drinks: Drink[] | null }> {
    return this.http.get<{ drinks: Drink[] | null }>(`${this.apiUrl}/search.php?s=${name}`);
  }

  getDrinkById(id: string): Observable<{ drinks: Drink[] | null }> {
    return this.http.get<{ drinks: Drink[] | null }>(`${this.apiUrl}/lookup.php?i=${id}`);
  }

  getDrinks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/filter.php?a=Alcoholic`);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list.php?c=list`);
  }

  getIngredients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list.php?i=list`);
  }

  getGlasses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list.php?g=list`);
  }

  // Cerca i cocktail combinando nome, categoria e ingrediente
  searchCocktails(name: string, category: string, ingredient: string, glass: string): Observable<{ drinks: Drink[] }> {
    let nameObs = name ? this.getCocktailByName(name) : of({ drinks: null });
    let categoryObs = category ? this.http.get<{ drinks: Drink[] }>(`${this.apiUrl}/filter.php?c=${category}`) : of({ drinks: null });
    let ingredientObs = ingredient ? this.http.get<{ drinks: Drink[] }>(`${this.apiUrl}/filter.php?i=${ingredient}`) : of({ drinks: null });
    let glassObs = glass ? this.http.get<{ drinks: Drink[] }>(`${this.apiUrl}/filter.php?g=${glass}`) : of({ drinks: null });

    return forkJoin([nameObs, categoryObs, ingredientObs, glassObs]).pipe(
      map(([nameRes, categoryRes, ingredientRes, glassRes]) => {
        let nameDrinks = nameRes.drinks || [];
        let categoryDrinks = categoryRes.drinks || [];
        let ingredientDrinks = ingredientRes.drinks || [];
        let glassDrinks = glassRes.drinks || [];

        // 🛠 Se nessun filtro è applicato, ritorna una lista vuota
        if (!name && !category && !ingredient && !glass) {
          return { drinks: [] };
        }

        // 🛠 Se almeno un filtro ha 0 risultati, l'output deve essere vuoto
        if (
          (name && nameDrinks.length === 0) ||
          (category && categoryDrinks.length === 0) ||
          (ingredient && ingredientDrinks.length === 0) ||
          (glass && glassDrinks.length === 0)
        ) {
          return { drinks: [] };
        }

        // 🛠 Creiamo la lista attiva con solo i filtri che hanno dati
        let activeLists = [nameDrinks, categoryDrinks, ingredientDrinks, glassDrinks].filter(list => list.length > 0);

        // 🛠 Intersezione tra tutte le liste attive
        let filteredDrinks = activeLists.reduce((acc, list) =>
          acc.filter(drink => list.some(d => d.idDrink === drink.idDrink)),
          activeLists[0] || []
        );

        return { drinks: filteredDrinks };
      })
    );
  }

}
