import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService
{
  private apiUrl = 'https://localhost:7047/api/users';

  constructor(private http: HttpClient) { }

  getGlasses(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7047/api/drinkDb/glasses');
  }

  deleteDrink(drinkData: any): Observable<any> {
    return this.http.delete<any>('https://localhost:7047/api/drinkdb/createdrink', drinkData);
  }

  createDrink(drinkData: any): Observable<any> {
    return this.http.post<any>('https://localhost:7047/api/drinkdb/createdrink', drinkData);
  }

  getUserFavorites(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}/favorites`);
  }

  addFavoriteDrink(userId: number, drinkId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/${userId}/favorites/${drinkId}`, {}, { responseType: 'text' });
  }

  removeFavoriteDrink(userId: number, drinkId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/favorites/${drinkId}`);
  }
}
