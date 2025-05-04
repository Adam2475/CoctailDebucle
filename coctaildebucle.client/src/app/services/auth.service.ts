import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private apiUrl = 'https://localhost:7047/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userIdSubject = new BehaviorSubject<number | null>(null); // Holds user ID
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.getUserId() !== null);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient)
  {
    const token = localStorage.getItem('token');
   /* console.log("local storage token: ", token);*/
  }

  register(user: any): Observable<any>
  {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any)
  {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          const token = response.token;
          const userId = response.userId;
          //console.log("Token:", token);
          //console.log("User ID:", userId);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify({ id: userId }));

          // Optionally, update BehaviorSubject for reactive updates
          this.userIdSubject.next(userId);
          this.isLoggedInSubject.next(true);
          this.loggedIn.next(true); // Update the logged-in state
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Reset BehaviorSubjects
    this.userIdSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.loggedIn.next(false);
  }

  private decodeJWT(token: string)
  {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  // Fetch the user details from the backend
  getUser(): Observable<any> {
    const userId = this.getUserId(); // Get the user ID from localStorage or state
    if (userId) {
      return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
        catchError(error => {
          console.error('Error fetching user data:', error);
          return of(null); // Return an empty observable if there's an error
        })
      );
    }
    return of(null); // Return an empty observable if userId is null
  }

  getUserId(): number | null
  {
    const user = localStorage.getItem('user');
  /*  console.log('getUserId() returning:', user);*/
    if (user)
    {
      return JSON.parse(user).id;
    }
    return null;
  }

  isLoggedIn(): boolean
  {
    return !!localStorage.getItem('user');
  }
}
