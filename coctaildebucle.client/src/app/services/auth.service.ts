import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private apiUrl = 'https://localhost:7047/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient)
  {
    const token = localStorage.getItem('token');
  }

  register(user: any): Observable<any>
  {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any>
  {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}
