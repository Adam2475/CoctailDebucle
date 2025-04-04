import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { GdprService } from '../../services/gdpr.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';
import { GdprBannerComponent } from '../gdpr/gdpr.component';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: true,
  styleUrls: ['./user-profile.component.css'],
  imports: [GdprBannerComponent, NgIf, NgFor]
})
export class UserProfileComponent implements OnInit, AfterViewInit
{
  @ViewChild(GdprBannerComponent) gdprBanner!: GdprBannerComponent;  // Access GDPR banner
  favoriteDrinks: any[] = [];
  userId: number | null = null;
  showGdprBanner: boolean = false;  // ✅ To control banne visibility
  consentGiven: boolean = false; // Define consentGiven here
  private apiUrl = 'https://localhost:7047/api/users';
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private gdprService: GdprService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // ✅ Get user ID from AuthService
   /* console.log('User ID:', this.userId);*/  // Print the user ID
    if (this.userId) {
      // Check GDPR consent from DB
      this.gdprService.getConsent(this.userId).subscribe(
        (response) => {
          console.log('GDPR Consent Response:', response);
          this.consentGiven = response.gdprConsent;
          this.showGdprBanner = !this.consentGiven;
          this.showGdprBanner = true;
          if (this.consentGiven == true)
          {
            console.log("ciao");
            this.loadFavoriteDrinks();
          }
        },
        (error) => {
          console.error('Error fetching GDPR consent:', error);
          this.showGdprBanner = true; // Default to showing banner if error occurs
        }
      );
    } else {
      console.error("User ID is null, cannot check consent");
      this.showGdprBanner = true;  // Default to showing banner if userId is null
    }
  }

  ngAfterViewInit(): void {
    // Ensure that the gdprBanner is available and then modify its showBanner property
    if (this.gdprBanner) {
      /*console.log('GDPR Banner Initialized:', this.gdprBanner);*/
    } else {
      console.warn('GDPR Banner is not yet initialized');
    }
  }

  onConsentChanged(given: boolean): void
  {
    this.showGdprBanner = !given;
    console.log('Consent Given:', given);
  }

  loadFavoriteDrinks(): void {
    console.log("loading drinks for user: ", this.userId);
    if (this.userId) {
      this.userService.getUserFavorites(this.userId).subscribe(
        (drinks) => {
          this.favoriteDrinks = drinks;
          console.log('Favorite drinks loaded:', this.favoriteDrinks);
        },
        (error) => {
          console.error('Error fetching favorite drinks:', error);
        }
      );
    }
  }

  withdrawConsent(): void {
    if (this.userId) {
      this.gdprService.withdrawConsent(this.userId).subscribe(
        () => {
          console.log("Consent withdrawn successfully");
          this.consentGiven = false;
          this.showGdprBanner = true;
          this.favoriteDrinks = []; // Optionally clear drinks
          window.location.reload();
        },
        (error) => {
          console.error("Error withdrawing consent:", error);
        }
      );
    } else {
      console.error("Cannot withdraw consent: userId is null");
    }
  }
}
