import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { GdprService } from '../../services/gdpr.service';
import { CocktailService } from '../../services/cocktail.service';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';
import { GdprBannerComponent } from '../gdpr/gdpr.component';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from "@ngx-translate/core";
// Ng Prime UI
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
// Debugging
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-favorite-drinks',
  standalone: true,
  templateUrl: './favorite-drinks.component.html',
  styleUrl: './favorite-drinks.component.css',
  imports: [NgFor, NgIf, TranslateModule, CardModule, ButtonModule,
    RouterModule]
})
export class FavoriteDrinksComponent
{
  ////////////////////////////
  // State Variables
  ////////////////////////////
  userId: number | null = null;
  consentGiven: boolean = false;
  isLoggedIn: boolean = false;
  ////////////////////////////
  // Favorites Selection
  ////////////////////////////
  favoriteDrinks: any[] = [];
  favoritesLenght: number = 0;
  ////////////////////////////
  // Random Selection
  ////////////////////////////
  randomSelection: any[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private drinkService: CocktailService,
    private gdprService: GdprService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.checkLogin();
    if (this.userId)
    {
      this.gdprService.getConsent(this.userId).subscribe(
        (response) => {
          this.consentGiven = response.gdprConsent;
          if (this.consentGiven && this.isLoggedIn)
            this.loadFavoriteDrinks();
          else
            this.loadRandomDrinks();
        },
        (error) => {
          console.error('Error fetching GDPR consent:', error);
        }
      );
    }
    else
      this.loadRandomDrinks();
  }

  checkLogin() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }
  
  removeFavoriteDrink(drinkId: number): void {
    if (!this.userId) {
      console.error("User ID is missing.");
      return;
    }

    this.http.delete(`https://localhost:7047/api/users/${this.userId}/favorites/${drinkId}`)
      .subscribe({
        next: () => {
          this.favoriteDrinks = this.favoriteDrinks.filter(drink => drink.id !== drinkId);
        },
        error: (err) => {
          console.error(`Failed to remove favorite drink: ${err}`);
        }
      });
  }

  loadFavoriteDrinks(): void
  {
    if (this.userId) {
      this.userService.getUserFavorites(this.userId).subscribe(
        (drinks) => {
          this.favoriteDrinks = drinks;
          this.favoritesLenght = this.favoriteDrinks.length;
          if (this.favoritesLenght == 0) {
            this.loadRandomDrinks();
          }
        },
        (error) => {
          console.error('Error fetching favorite drinks:', error);
        }
      );
    }
  }

  loadRandomDrinks(): void {
    this.drinkService.getActiveSelectionDrinks().subscribe(
      (drinks) => {
        const shuffled = drinks.sort(() => 0.5 - Math.random());
        this.randomSelection = shuffled.slice(0, 3);
      },
      (error) => {
        console.error("Error loading random drinks:", error);
      }
    );
  }

  refreshFavorites(): void {
    this.loadFavoriteDrinks(); // or however you're loading them
  }
}
