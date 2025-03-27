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

  // Cerca i cocktail combinando nome, categoria e ingrediente
  searchCocktails(name: string, category: string, ingredient: string): Observable<{ drinks: Drink[] }> {
    let nameObs = name ? this.getCocktailByName(name) : of({ drinks: [] });
    let categoryObs = category ? this.http.get<{ drinks: Drink[] }>(`${this.apiUrl}/filter.php?c=${category}`) : of({ drinks: [] });
    let ingredientObs = ingredient ? this.http.get<{ drinks: Drink[] }>(`${this.apiUrl}/filter.php?i=${ingredient}`) : of({ drinks: [] });

    return forkJoin([nameObs, categoryObs, ingredientObs]).pipe(
      map(([nameRes, categoryRes, ingredientRes]) => {
        let nameDrinks: Drink[] = nameRes.drinks || [];
        let categoryDrinks: Drink[] = categoryRes.drinks || [];
        let ingredientDrinks: Drink[] = ingredientRes.drinks || [];

        // 🔥 Se nessun filtro è applicato, ritorna lista vuota
        if (!name && !category && !ingredient) {
          return { drinks: [] };
        }

        // 🔥 Lista attiva: solo i filtri che hanno dati
        let activeLists: Drink[][] = [nameDrinks, categoryDrinks, ingredientDrinks].filter(list => list.length > 0);

        // 🔥 Se un filtro è vuoto e gli altri hanno dati, il risultato è vuoto
        if (activeLists.length > 0 && activeLists.some(list => list.length === 0)) {
          return { drinks: [] };
        }

        // 🔥 Intersezione corretta: parte dalla prima lista e filtra con le altre
        let filteredDrinks = activeLists.reduce((acc, list) =>
          acc.filter(drink => list.some(d => d.idDrink === drink.idDrink)),
          activeLists[0]
        );

        return { drinks: filteredDrinks };
      })
    );
  }

}
