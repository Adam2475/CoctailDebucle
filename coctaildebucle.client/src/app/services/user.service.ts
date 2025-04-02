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

  getUserFavorites(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/favorites/`);
  }
  addFavoriteDrink(userId: number, drinkId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${userId}/favorites/${drinkId}`, {});
  }
}
