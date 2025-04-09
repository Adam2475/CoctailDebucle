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
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DrinkIngredient {
  ingredientId: number;
  amount: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: true,
  styleUrls: ['./user-profile.component.css'],
  imports: [GdprBannerComponent, NgIf, NgFor, FormsModule]
})
export class UserProfileComponent implements OnInit, AfterViewInit
{
  @ViewChild(GdprBannerComponent) gdprBanner!: GdprBannerComponent;  // Access GDPR banner
  //////////////////////////////////////
  // Cocktail Import
  drink: any = {
    name: '',
    category: '',
    glassId: 0,
    instructions: '',
    ingredients: [] as { ingredientId: number, amount: string }[]
  };
  selectedFile: File | null = null;
  ingredientsInput: string = '[]'; // Store raw JSON from the input
  ingredients: { ingredientId: number; amount: string }[] = [];
  //////////////////////////////////////
  favoriteDrinks: any[] = [];
  userId: number | null = null;
  showGdprBanner: boolean = false;  // ✅ To control banne visibility
  consentGiven: boolean = false; // Define consentGiven here
  selectedIngredients: any[] = []; // Array to hold the selected ingredients for the drink
  ingredientsList: any[] = []; // This will hold the list of ingredients fetched from the API
  private apiUrl = 'https://localhost:7047/api/users';
  availableIngredients: any[] = [];
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private gdprService: GdprService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Get Id from AuthService
    this.userId = this.authService.getUserId();
    if (this.userId)
    {
      // Check GDPR consent from DB
      this.gdprService.getConsent(this.userId).subscribe(
        (response) => {
          this.consentGiven = response.gdprConsent;
          this.showGdprBanner = !this.consentGiven;
          this.showGdprBanner = true;
          if (this.consentGiven == true)
          {
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
    // Load ingredients from API
    this.http.get<any[]>('https://localhost:7047/api/drinkDb/ingredients').subscribe({
      next: (data) => {
        this.availableIngredients = data;
        console.log('Loaded ingredients:', data);
      },
      error: (err) => console.error('Failed to load ingredients:', err)
    });

    this.ingredients.push({ ingredientId: 0, amount: '' }); // Start with 1 blank row
  }

  addIngredient() {
    this.drink.ingredients.push({ ingredientId: 0, amount: '' });
  }

  removeIngredient(index: number) {
    this.drink.ingredients.splice(index, 1);
  }

  loadIngredients() {
    this.http.get<any[]>('https://localhost:7047/api/drinkDb/ingredients').subscribe({
      next: (data) => this.availableIngredients = data,
      error: (err) => console.error('Failed to load ingredients:', err)
    });

    // Optionally start with one blank ingredient
    this.drink.ingredients.push({ ingredientId: 0, amount: '' });
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
  }

  loadFavoriteDrinks(): void {
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

  goBack(): void {
    this.location.back(); // Navigate back to the previous page
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    //const formData = new FormData();
    //formData.append('name', this.drink.name);
    //formData.append('category', this.drink.category);
    //formData.append('glassId', this.drink.glassId.toString());
    //formData.append('instructions', this.drink.instructions);
    console.log("hello world!");

    //try {
    //  console.log(this.ingredientsInput)
    //  const parsedIngredients = JSON.parse(this.ingredientsInput);
    //  console.log(parsedIngredients)
    //  formData.append('ingredientsJson', JSON.stringify(parsedIngredients));
    //} catch (error) {
    //  alert('Invalid JSON in ingredients field.');
    //  return;
    //}
    //console.log('Ingredients:', this.drink.ingredients);
    // Send the ingredients directly as a JSON string
    /* formData.append('ingredientsJson', JSON.stringify(this.drink.ingredients));*/
    // Map the ingredients to the expected format

    //const mappedIngredients = this.drink.ingredients.map((ingredient: DrinkIngredient) => {
    //  return {
    //    ingredientId: ingredient.ingredientId, // Only send the ingredientId
    //    amount: ingredient.amount
    //  };
    //});
    // Send the mapped ingredients as a JSON string
    //formData.append('ingredients', JSON.stringify(mappedIngredients));
    //formData.append('ingredientsJson', JSON.stringify(parsedIngredients));
    /*formData.append('ingredientsJson', JSON.stringify(this.drink.ingredients));*/
    //const mappedIngredients = this.drink.ingredients.map((ingredient: DrinkIngredient) => ({
    //  IngredientId: Number(ingredient.ingredientId),
    //  Amount: ingredient.amount
    //}));
    //console.log('Sending Ingredients JSON:', mappedIngredients);
    //formData.append('ingredientsJson', mappedIngredients);
    ////formData.append('ingredientsJson', mappedIngredients);


    //if (this.selectedFile) {
    //  formData.append('image', this.selectedFile, this.selectedFile.name);
    //}

    //this.http.post('https://localhost:7074/api/drinkDb', formData).subscribe({
    //  next: () => alert('Drink created!'),
    //  error: err => console.error(err)
    //});
  }
}
