import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GdprService {
  // using a shared service
  private showBannerSubject = new BehaviorSubject<boolean>(false);
  showBanner$ = this.showBannerSubject.asObservable();
  private apiUrl = 'https://localhost:7047/api/users';

  constructor(private http: HttpClient) { }

  setShowBanner(value: boolean): void {
    this.showBannerSubject.next(value);
  }

  // your other methods like getConsent, giveConsent, etc.

  getConsent(userId: number): Observable<{ gdprConsent: boolean }> {
    return this.http.get<{ gdprConsent: boolean }>(`${this.apiUrl}/${userId}/consent`);
  }

  giveConsent(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/consent`, true);
  }
  withdrawConsent(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/consent`);
  }
}
