import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { GdprService } from '../../services/gdpr.service';
import { CocktailService } from '../../services/cocktail.service';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';
import { GdprBannerComponent } from '../gdpr/gdpr.component';
import { FavoriteDrinksComponent } from '../favorite-drinks/favorite-drinks.component';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
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
  imports: [GdprBannerComponent, NgIf, NgFor, FormsModule,
    ReactiveFormsModule, ButtonModule, FavoriteDrinksComponent]
})
export class UserProfileComponent implements OnInit, AfterViewInit
{
  @ViewChild(GdprBannerComponent) gdprBanner!: GdprBannerComponent;
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
  ingredientsInput: string = '[]';
  //////////////////////////////////////
  editingDrinkId: number | null = null
  favoriteDrinks: any[] = [];
  userDrinks: any[] = [];
  showGdprBanner: boolean = false;
  consentGiven: boolean = false;
  selectedIngredients: any[] = [];
  ingredientsList: any[] = [];
  private apiUrl = 'https://localhost:7047/api/users';
  availableIngredients: any[] = [];
  /////////////////////////////////
  // Cocktail Modification Form
  /////////////////////////////////
  selectedDrink: any = null;
  modifyForm!: FormGroup;
  ingredientOptions: { id: number; name: string }[] = [];
  /*  favoriteDrinks$: Observable<Drink[]>;*/
  ////////////////////////////
  // Search Bar Created Drinks
  ////////////////////////////
  searchQuery: string = '';
  filteredUserDrinks: any[] = [];

  ////////////////////////////
  // Update user
  ////////////////////////////
  profileForm!: FormGroup;
  passwordMismatch: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

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
          //if (this.consentGiven == true)
          //{
          //  this.loadFavoriteDrinks();
          //}
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
            this.onSearchQueryChange();
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
    // Load ingredients from DB
    this.http.get<any[]>('https://localhost:7047/api/drinkDb/ingredients').subscribe({
      next: (data) => {
        this.availableIngredients = data;
       // console.log('Loaded ingredients:', data);
      },
      error: (err) => console.error('Failed to load ingredients:', err)
    });
    // Load glasses from DB
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

    // Initialize the modify form (fields same as create form)
    this.modifyForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      glassId: [null, Validators.required],
      instructions: ['', Validators.required],
      ingredients: this.fb.array([])  // Initialize the ingredients as an empty arra
    });

    this.fetchUserDrinksImage();
    this.fetchIngredientOptions();
    this.initProfileForm();
    this.loadUserData(); //per form informazioni utente
    this.filteredUserDrinks = this.userDrinks;//barra ricerca drink creati
  }

  ////////////////////////////
  // Search Bar Created Drinks
  ////////////////////////////
  onSearchQueryChange() {
    const query = this.searchQuery.toLowerCase();
    //se barra ricerca vuota
    if (!query) {
      this.filteredUserDrinks = [...this.userDrinks];//mostra tutti drink creati
    } else {
      this.filteredUserDrinks = this.userDrinks.filter(drink =>
        drink.name.toLowerCase().includes(query)
      );
    }
  }

  ////////////////////////////
  // Update user
  ////////////////////////////
  private initProfileForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      birthDate: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gdprConsent: [false],
      newPassword: [''],
      confirmNewPassword: ['']
    });
  }

  private loadUserData(): void {
    this.http.get<any>(`https://localhost:7047/api/auth/${this.userId}`).subscribe(user => {
      const date = new Date(user.birthDate);
      const formattedDate = date.toISOString().split('T')[0];
      this.profileForm.patchValue({
        name: user.name,
        surname: user.surname,
        birthDate: formattedDate,
        username: user.username,
        email: user.email,
        gdprConsent: this.consentGiven,
      });
    });
  }

  onProfileUpdate(): void {
    this.passwordMismatch = false;

    const newPass = this.profileForm.get('newPassword')?.value;
    const confirmPass = this.profileForm.get('confirmNewPassword')?.value;

    if (newPass && newPass !== confirmPass) {
      this.passwordMismatch = true;
      return;
    }

    const updateData: any = {
      name: this.profileForm.value.name,
      surname: this.profileForm.value.surname,
      birthDate: this.profileForm.value.birthDate,
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      gdprConsent: !!this.profileForm.value.gdprConsent,
      password: ""
    };

    if (newPass) {
      updateData.password = newPass;
    }

    console.log('Payload inviato:', updateData);//da commentare prima di consegna
    this.http.put(`https://localhost:7047/api/auth/update/${this.userId}`, updateData).subscribe(
      response => {
        console.log('Successo aggiornamento profilo:', response);
      },
      error => {
        console.error('Errore aggiornamento profilo:', error);
      }
    );

    this.consentGiven = this.profileForm.value.gdprConsent;
    this.onConsentChanged(this.consentGiven);
    
  }


  editableFields = [
    { label: 'Name', controlName: 'name', type: 'text', editing: false },
    { label: 'Surname', controlName: 'surname', type: 'text', editing: false },
    { label: 'Birth Date', controlName: 'birthDate', type: 'date', editing: false },
    { label: 'Username', controlName: 'username', type: 'text', editing: false },
    { label: 'Email', controlName: 'email', type: 'email', editing: false },
    //{ label: 'GDPR Consent', controlName: 'gdprConsent', type: 'checkbox', editing: true }
  ];

  passwordEditMode = false;

  toggleEdit(field: any): void {
    field.editing = !field.editing;
  }

  togglePasswordEdit(): void {
    this.passwordEditMode = !this.passwordEditMode;
    if (!this.passwordEditMode) {
      this.profileForm.patchValue({ newPassword: '', confirmNewPassword: '' });
    }
  }

  ////////////////////////////
  // Update user ^^^
  ////////////////////////////

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

  fetchIngredientOptions() {
    this.http.get<any[]>('https://localhost:7047/api/drinkDb/ingredients')
      .subscribe({
        next: (data) => {
          this.ingredientOptions = data;
        },
        error: (err) => {
          console.error('Failed to load ingredient options', err);
        }
      });
  }

  // for creation
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

  // for modification
  get modifyIngredients(): FormArray {
    return this.modifyForm.get('ingredients') as FormArray;
  }

  addModifyIngredient(): void {
    // Add an empty ingredient to the modify form if needed
    this.modifyIngredients.push(
      this.fb.group({
        ingredientId: [null, Validators.required],
        amount: ['', Validators.required],
      })
    );
  }

  removeModifyIngredient(index: number): void {
    this.modifyIngredients.removeAt(index);
  }

  initializeModifyIngredients(): void {
    // This function should initialize ingredients in modify form
    const ingredientsArray = this.selectedDrink?.drinkIngredients || [];

    // Add existing ingredients to modify form
    ingredientsArray.forEach((ingredient: { ingredientId: number, amount: string }) => {
      this.modifyIngredients.push(
        this.fb.group({
          ingredientId: [ingredient.ingredientId, Validators.required],
          amount: [ingredient.amount, Validators.required],
        })
      );
    });
  }

  createIngredient(ingredient?: any): FormGroup {
    return this.fb.group({
      ingredientId: [ingredient?.ingredientId || '', Validators.required],
      amount: [ingredient?.amount || '', Validators.required]
    });
  }

  /////////////////////////
  // Gdpr Consent Methods
  /////////////////////////

  onConsentChanged(given: boolean): void
  {
    this.showGdprBanner = !given;
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
          this.showGdprBanner = true;//forse togliere se gestiamo gdpr tutto da modulo informazioni utente
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

  ////////////////////////////
  // Drink Fetching Methods
  ////////////////////////////

  getUserDrinks(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7047/api/drinkDb/user/${userId}`);
  }

  fetchUserDrinks() {
    if (!this.userId) return;

    this.getUserDrinks(this.userId).subscribe({
      next: (drinks) => {
        console.log("Fetched drinks:", drinks);
        this.userDrinks = drinks;
        this.onSearchQueryChange();//per ricerca drink creati
      },
      error: (err) => {
        console.error("Failed to fetch drinks:", err);
      }
    });
  }

  fetchUserDrinksImage() {
    if (!this.userId) return;

    this.getUserDrinks(this.userId).subscribe({
      next: (drinks) => {
        this.userDrinks = drinks;
        this.onSearchQueryChange();
        this.userDrinks.forEach(drink => this.loadImageForDrink(drink));
      },
      error: (err) => {
        console.error("Failed to fetch drinks:", err);
      }
    });
  }

  loadImageForDrink(drink: any): void {
   /* console.log("ciao cicci");*/
    this.http.get(`https://localhost:7047/api/drinkDb/${drink.id}/image`, { responseType: 'blob' })
      .subscribe(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          drink.imageUrl = reader.result as string; // base64 string
    /*      console.log('Image loaded for drink:', drink.name, drink.imageUrl);*/
        };
        reader.readAsDataURL(blob);
      });
  }

  ////////////////////////////
  // User Drink Creation
  ////////////////////////////

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
          this.uploadDbImage(response.id, this.selectedFile).subscribe({
            next: () => {
              console.log('Image uploaded successfully');
              // Add the created drink to the UI and refresh
              this.userDrinks.push(response);
              this.fetchUserDrinksImage();
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

  uploadDbImage(drinkId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('ImagePath', imageFile); // must match the DTO

    // updated endpoint for DB storage
    return this.http.post(`https://localhost:7047/api/drinkDb/uploadImageToDb/${drinkId}`, formData);
  }

  uploadDrinkImage(drinkId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('ImagePath', imageFile); // must match your DTO property

    return this.http.post(`https://localhost:7047/api/drinkDb/uploadImage/${drinkId}`, formData);
  }

  onDeleteDrink(drinkId: number): void {
    if (!confirm("Are you sure you want to delete this drink?")) return;

    this.userService.deleteDrink(drinkId).subscribe({
      next: () => {
        console.log(`Drink ${drinkId} deleted`);
        this.userDrinks = this.userDrinks.filter(d => d.id !== drinkId);
        this.fetchUserDrinksImage();
      },
      error: err => {
        console.error("Failed to delete drink:", err);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  deleteDrink(id: number) {
    if (confirm('Are you sure you want to delete this drink?')) {
      this.drinkService.deleteDrink(id).subscribe(() => {
        //this.loadDrinks(); // refresh
        this.fetchUserDrinksImage(); 
      });
    }
  }

  cancelEdit() {
    this.editingDrink = null;
  }

  ////////////////////////////
  // Favorites Methods
  ////////////////////////////

  addToFavorites(drinkId: number) {
    const userId = this.authService.getUserId(); // however you track user
    if (userId) {
      this.userService.addFavoriteDrink(userId, drinkId).subscribe({
        next: () => {
          console.log('Drink added to favorites');
          this.fetchFavoriteDrinks();
        },
        error: err => console.error('Failed to add to favorites', err)
      });
    }
  }

  fetchFavoriteDrinks() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.userService.getUserFavorites(userId).subscribe({
      next: (favorites) => {
        console.log("Fetched favorite drinks:", favorites);
        this.favoriteDrinks = favorites;
      },
      error: (err) => {
        console.error("Failed to fetch favorite drinks:", err);
      }
    });
  }

  /////////////////////////////////
  // Drink Modification Methods
  /////////////////////////////////

  onModifyClick(drink: any): void {
    this.selectedDrink = drink;

    // Patch basic values:
    this.modifyForm.patchValue({
      name: drink.name,
      category: drink.category,
      instructions: drink.instructions,
      glassId: drink.glassId
    });

    // Populate the FormArray for ingredients (do not clear if there are already controls):
    const ingredientsControl = this.modifyForm.get('ingredients') as FormArray;

    if (ingredientsControl.length === 0) {
      // If no ingredients are present, clear and add them
      drink.drinkIngredients.forEach((di: any) => {
        ingredientsControl.push(this.fb.group({
          ingredientId: [di.ingredient?.id || di.ingredientId, Validators.required],
          amount: [di.amount, Validators.required]
        }));
      });
    }
  }

  cancelModification(): void {
    this.selectedDrink = null;
    this.modifyForm.reset();
  }

  loadDrinkData(drink: any) {
    this.modifyForm.patchValue({
      name: drink.name,
      category: drink.category,
      instructions: drink.instructions,
      glassId: drink.glassId
    });

    const ingredientArray = this.modifyForm.get('ingredients') as FormArray;
    ingredientArray.clear();
    drink.ingredients.forEach((i: any) => {
      ingredientArray.push(this.createIngredient(i));
    });
  }

  submitModification(drinkId: number): void
  {
    if (!this.modifyForm.valid) return;

    const formValue = this.modifyForm.value;
    const ingredients = formValue.ingredients || []; // fallback if undefined

    const payload = {
      name: this.modifyForm.value.name,
      category: this.modifyForm.value.category,
      instructions: this.modifyForm.value.instructions,
      glassId: this.modifyForm.value.glassId,
      ingredients: this.modifyForm.value.ingredients.map((ing: any) => ({
        ingredientId: ing.ingredientId,
        amount: ing.amount
      }))
    };
    //console.log("object passed: ", this.modifyForm);
    this.http.put(`https://localhost:7047/api/drinkDb/${drinkId}`, payload).subscribe({
      next: () => {
        console.log('Update success');
        this.fetchUserDrinksImage();   
        this.selectedDrink = null; 
      },
      error: err => console.error('Update failed:', err)
    });
  }
  // ----------------------------------------- //

}
