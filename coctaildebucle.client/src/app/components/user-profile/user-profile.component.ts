import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { GdprService } from '../../services/gdpr.service';
import { CocktailService } from '../../services/cocktail.service';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';
import { GdprBannerComponent } from '../gdpr/gdpr.component';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

interface DrinkIngredient {
  ingredientId: number;
  amount: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: true,
  styleUrls: ['./user-profile.component.css'],
  imports: [GdprBannerComponent, NgIf, NgFor, FormsModule, JsonPipe,
    ReactiveFormsModule]
})
export class UserProfileComponent implements OnInit, AfterViewInit
{
  @ViewChild(GdprBannerComponent) gdprBanner!: GdprBannerComponent;  // Access GDPR banner
  ////////////////////////
  // Cocktail Import
  ////////////////////////
  drinkForm!: FormGroup;
  userId: number | null = null;
  editingDrink: any = null;
  editForm!: FormGroup;
  drink: any = {
    name: '',
    category: '',
    glassId: 0,
    instructions: '',
    userId: this.userId,
    ingredients: [] as { ingredientId: number, amount: string }[],
  };
  selectedFile: File | null = null;
  glassList: any[] = [];
  ingredientsInput: string = '[]'; // Store raw JSON from the input
  //////////////////////////////////////
  editingDrinkId: number | null = null
  favoriteDrinks: any[] = [];
  userDrinks: any[] = [];
  showGdprBanner: boolean = false;
  consentGiven: boolean = false; // Define consentGiven here
  selectedIngredients: any[] = []; // Array to hold the selected ingredients for the drink
  ingredientsList: any[] = []; // This will hold the list of ingredients fetched from the API
  private apiUrl = 'https://localhost:7047/api/users';
  availableIngredients: any[] = [];
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
      this.http.get<any[]>(`https://localhost:7047/api/drinkDb/user/${this.userId}`)
        .subscribe({
          next: (data) => {
            this.userDrinks = data;
            //console.log("crated drinks: ", this.userDrinks);
          },
          error: (err) => {
            console.error('Error fetching drinks:', err);
          }
        });

    } else {
      console.error("User ID is null, cannot check consent");
      this.showGdprBanner = true;  // Default to showing banner if userId is null
    }
    // Load ingredients from API
    this.http.get<any[]>('https://localhost:7047/api/drinkDb/ingredients').subscribe({
      next: (data) => {
        this.availableIngredients = data;
       // console.log('Loaded ingredients:', data);
      },
      error: (err) => console.error('Failed to load ingredients:', err)
    });

    this.http.get<any[]>('https://localhost:7047/api/drinkDb/glasses').subscribe({
      next: (data) => {
        this.glassList = data;
        //console.log('Loaded glasses:', data);
      },
      error: (err) => console.error('Failed to load glasses:', err)
    });

    /*this.ingredients.push({ ingredientId: 0, amount: '' }); // Start with 1 blank row*/
    this.drinkForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      glassId: [null, Validators.required],
      instructions: ['', Validators.required],
      ingredients: this.fb.array([])
    });
  }

  ngAfterViewInit(): void {
    // Ensure that the gdprBanner is available and then modify its showBanner property
    if (this.gdprBanner) {
      /*console.log('GDPR Banner Initialized:', this.gdprBanner);*/
    } else {
      console.warn('GDPR Banner is not yet initialized');
    }
  }

  /////////////////////////
  // Ingredients Methods
  /////////////////////////
  get ingredients(): FormArray {
    return this.drinkForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(
      this.fb.group({
        ingredientId: [null, Validators.required],
        amount: ['', Validators.required],
      })
    );
  }

  removeIngredient(index: number) {
    this.drink.ingredients.splice(index, 1);
  }

  loadIngredients() {
    this.http.get<any[]>('https://localhost:7047/api/drinkDb/ingredients').subscribe({
      next: (data) => this.availableIngredients = data,
      error: (err) => console.error('Failed to load ingredients:', err)
    });
  }

  /////////////////////////
  // Gdpr Consent Methods
  /////////////////////////

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

  loadDrinks(): void {
    this.drinkService.getDrinks().subscribe({
      next: (data) => this.drink = data,
      error: (err) => console.error('Error loading drinks:', err)
    });
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

  uploadDrinkImage(drinkId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('ImagePath', imageFile); // must match your DTO property

    return this.http.post(`https://localhost:7047/api/drinkDb/uploadImage/${drinkId}`, formData);
  }

  onSubmit(): void {
    if (this.drinkForm.invalid) return;

    const drinkData = this.drinkForm.value;

    drinkData.ingredients = drinkData.ingredients.map((ing: any) => ({
      ingredientId: Number(ing.ingredientId),
      amount: ing.amount
    }));

    // forgot injecting userId to creation
    drinkData.userId = this.userId;

    this.userService.createDrink(drinkData).subscribe({
      next: (response) => {
        console.log('Drink created successfully:', response);
        if (this.selectedFile && response.id) {
          this.uploadDrinkImage(response.id, this.selectedFile).subscribe({
            next: () => {
              console.log('Image uploaded successfully');
              // Add the created drink to the UI
              this.userDrinks.push(response);
            },
            error: (err) => {
              console.error('Image upload failed:', err);
            }
          });
        }
      },
      error: (err) => {
        console.log(this.userId)
        console.error('Drink creation failed:', err);
      }
    });
  }

  onDeleteDrink(drinkId: number): void {
    if (!confirm("Are you sure you want to delete this drink?")) return;

    this.userService.deleteDrink(drinkId).subscribe({
      next: () => {
        console.log(`Drink ${drinkId} deleted`);
        this.userDrinks = this.userDrinks.filter(d => d.id !== drinkId);
      },
      error: err => {
        console.error("Failed to delete drink:", err);
      }
    });
  }

  deleteDrink(id: number) {
    if (confirm('Are you sure you want to delete this drink?')) {
      this.drinkService.deleteDrink(id).subscribe(() => {
        this.loadDrinks(); // refresh
      });
    }
  }

  editDrink(drink: any) {
    this.editingDrink = drink;

    this.editForm.patchValue({
      name: drink.name,
      category: drink.category,
      glassId: drink.glassId,
      instructions: drink.instructions,
      // Ingredients will be handled separately if needed
    });
  }

  submitEdit() {
    const updatedDrink = {
      ...this.editForm.value,
      userId: this.editingDrink.userId,
      ingredients: this.editingDrink.drinkIngredients.map((i: any) => ({
        ingredientId: i.ingredient.id,
        amount: i.amount
      }))
    };

    this.drinkService.updateDrink(this.editingDrink.id, updatedDrink).subscribe(() => {
      this.editingDrink = null;
      this.loadDrinks();
    });
  }

  cancelEdit() {
    this.editingDrink = null;
  }
}
