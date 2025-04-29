import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { GdprService } from '../../services/gdpr.service';
import { CocktailService } from '../../services/cocktail.service';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';
import { GdprBannerComponent } from '../gdpr/gdpr.component';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-favorite-drinks',
  standalone: true,
  templateUrl: './favorite-drinks.component.html',
  styleUrl: './favorite-drinks.component.css',
  imports: [NgFor, NgIf]
})
export class FavoriteDrinksComponent
{
  userId: number | null = null;
  consentGiven: boolean = false;
  favoriteDrinks: any[] = [];
  isLoggedIn: boolean = false;
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
          if (this.consentGiven && this.isLoggedIn) {
            console.log(this.isLoggedIn);
            this.loadFavoriteDrinks();
          }
        },
        (error) => {
          console.error('Error fetching GDPR consent:', error);
        }
      );
    } else {
      console.error("User ID is null, cannot check consent");
    }
  }

  checkLogin() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  loadFavoriteDrinks(): void
  {
    /* console.log("loading drinks for user: ", this.userId);*/
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
}
