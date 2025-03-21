import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CocktailService
{
  private apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink'; // Example endpoint to fetch drinks

  constructor(private http: HttpClient) {}

  // Method to fetch drinks
  getDrinks(): Observable<any>
  {
    return this.http.get<any>(this.apiUrl);
  }

  getCocktailDetails(id: string): Observable<any>
  {
    return this.http.get(`${this.apiUrl}/lookup.php?i=${id}`);
  }

  getDrinkById(id: string): Observable<any>
  {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
    console.log("API URL:", url);  // Log the URL to check if it's correct
    return this.http.get<any>(url);
  }

  //getCocktailByName(name: string): Observable<any> {
  //  return this.http.get<any>(`http://localhost:62695/api/cocktails/search?name=${name}`);
  //}

  getCocktailByName(name: string): Observable<any>
  {
    return this.http.get<any>(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
  }
}
