import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private apiUrl = 'https://localhost:7047/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userIdSubject = new BehaviorSubject<number | null>(null); // Holds user ID
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
          this.loggedIn.next(true); // Update the logged-in state
        }
      })
    );
  }

  private decodeJWT(token: string)
  {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
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
