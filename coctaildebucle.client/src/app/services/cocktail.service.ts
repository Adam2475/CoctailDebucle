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

  //////////////////////////
  // DB Cocktail methods
  //////////////////////////

  updateDrink(id: number, drinkData: any) {
    return this.http.put(`https://localhost:7047/api/drinkDb/${id}`, drinkData);
  }

  deleteDrink(id: number) {
    return this.http.delete(`https://localhost:7047/api/drinkDb/${id}`);
  }

  ///////////////////////////
  // API Cocktail methods
  ///////////////////////////

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

  //////////////////////////////////////////////
  // Ingredient and glassed getter and setter
  //////////////////////////////////////////////

  getIngredients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list.php?i=list`);
  }

  getGlasses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list.php?g=list`);
  }

  getAllIngredients() {
    return this.http.get<any[]>('https://localhost:7047/api/drinkDb/ingredients');
  }

  getAllGlasses() {
    return this.http.get<any[]>('https://localhost:7047/api/drinkDb/glasses');
  }

  saveIngredients(ingredients: { name: string }[]) {
    return this.http.post('https://localhost:7047/api/drinkDb/ingredients', ingredients);
  }

  saveGlasses(glasses: { name: string }[]) {
    return this.http.post('https://localhost:7047/api/drinkDb/glasses', glasses);
  }

  ///////////////////////////////////////////////////////////////

  // Cerca i cocktail combinando nome, categoria e ingrediente
  searchCocktails(name: string, category: string, ingredients: string, glass: string): Observable<{ drinks: Drink[] }> {
    let nameObs = name ? this.getCocktailByName(name) : of({ drinks: null });
    let categoryObs = category ? this.http.get<{ drinks: Drink[] }>(`${this.apiUrl}/filter.php?c=${category}`) : of({ drinks: null });
    let glassObs = glass ? this.http.get<{ drinks: Drink[] }>(`${this.apiUrl}/filter.php?g=${glass}`) : of({ drinks: null });

    // modifica per admin: se ci sono più ingredienti, fai una forkJoin di tutte le chiamate filter.php?i=...
    let ingredientList = ingredients ? ingredients.split(',') : [];
    let ingredientObs = ingredientList.length > 0
      ? forkJoin(ingredientList.map(ing =>
        this.http.get<{ drinks: Drink[] | null }>(`${this.apiUrl}/filter.php?i=${ing}`)
      ))
      : of([]);

    return forkJoin([nameObs, categoryObs, ingredientObs, glassObs]).pipe(
      map(([nameRes, categoryRes, ingredientResponses, glassRes]) => {
        let nameDrinks = nameRes.drinks || [];
        let categoryDrinks = categoryRes.drinks || [];
        let glassDrinks = glassRes.drinks || [];

        //modifica per admin:  Unisci i risultati di tutti gli ingredienti (evita null)
        let ingredientDrinks = (ingredientResponses as any[])
          .flatMap(res => res.drinks || []);

        // Se nessun filtro è attivo, ritorna lista vuota
        if (!name && !category && ingredientList.length === 0 && !glass) {
          return { drinks: [] };
        }

        // Se uno qualsiasi dei filtri ha 0 risultati, ritorna lista vuota
        if (
          (name && nameDrinks.length === 0) ||
          (category && categoryDrinks.length === 0) ||
          (ingredientList.length > 0 && ingredientDrinks.length === 0) ||
          (glass && glassDrinks.length === 0)
        ) {
          return { drinks: [] };
        }

        // Intersezione tra tutti i risultati
        let activeLists = [nameDrinks, categoryDrinks, ingredientDrinks, glassDrinks]
          .filter(list => list.length > 0);

        let filteredDrinks = activeLists.reduce((acc, list) =>
          acc.filter(drink => list.some(d => d.idDrink === drink.idDrink)),
          activeLists[0] || []
        );

        return { drinks: filteredDrinks };
      })
    );
  }

  getDrinkDetails(id: string) {
    return this.http.get<any>(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  }

}
