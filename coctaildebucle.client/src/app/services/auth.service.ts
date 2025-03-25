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
  private loggedIn = new BehaviorSubject<boolean>(false); // Default: false
  //isLoggedIn$ = this.loggedIn.asObservable(); // Observable to track changes
  constructor(private http: HttpClient)
  {
    //// Check if token exists on page refresh
    const token = localStorage.getItem('token');
    //if (token) {
    //  this.loggedIn.next(true);
    //}
  }

  register(user: any): Observable<any>
  {
    return this.http.post(`${this.apiUrl}/register`, user);
  }


  //login(token: string) {
  //  localStorage.setItem('token', token); // Store token
  //  this.loggedIn.next(true); // Update login state
  //}
  login(credentials: any): Observable<any>
  {
    //localStorage.setItem('token', token);
    //this.loggedIn.next(true);
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  //logout() {
  //  localStorage.removeItem('token'); // Remove token
  //  this.loggedIn.next(false); // Update login state
  //}
}
