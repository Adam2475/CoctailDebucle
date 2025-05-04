import { Component } from '@angular/core';
import { DrinkCardsComponent } from '../drink-cards/drink-cards.component'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CocktailService } from '../../services/cocktail.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FavoriteDrinksComponent } from '../favorite-drinks/favorite-drinks.component';
import { RouterModule } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { TranslateModule } from "@ngx-translate/core";
//import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from '../../services/language.service';


/*TranslateModule,*/
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    FavoriteDrinksComponent,
    DrinkCardsComponent,
    RouterModule,
    NgFor,
    TranslateModule
  ]
})
export class HomeComponent
{
  searchQuery: string = '';
  drinks: any[] = [];
  categories: string[] = [];
  ingredients: string[] = [];
  glasses: string[] = [];
  selectedCategory: string = '';
  selectedIngredient: string = '';
  selectedGlass: string = '';
  isLoggedIn: boolean = false;

  /////////////////////////
  // Language Dropdown
  /////////////////////////
  availableLanguages: string[] = [];
  currentLang: string = 'en';
  dropdownOpen = false;



  constructor(
    private http: HttpClient,
    private cocktailService: CocktailService,
    private authService: AuthService,
    private router: Router,
    //private translate: TranslateService,
    private languageService: LanguageService
  )
  {
    //const lang = localStorage.getItem('lang') || 'en';
    //translate.setDefaultLang(lang);
    //translate.use(lang);
  }
  //private isLoggedInSubject = new BehaviorSubject<boolean>(this.authService.getUserId() !== null);

  ngOnInit()
  {
    this.checkLogin();
    this.availableLanguages = this.languageService.getAvailableLanguages();
    this.currentLang = this.languageService.getCurrentLang();
    this.checkLogin();
/*    this.loadCategories();*/
    //this.loadIngredients();
    //this.loadGlasses();
  }

  checkLogin()
  {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  // Navigate to the user's personal page.
  navigateToProfile()
  {
    this.router.navigate(['/profile']);
  }

  searchDrinks(query: string): Observable<any>
  {
    const url = `https://yourapi.com/api/cocktail?name=${query}`;
    return this.http.get<any>(url);
  }

  loadCategories()
  {
    this.cocktailService.getCategories().subscribe(response => {
      this.categories = response.drinks
        .map((c: any) => c.strCategory)
        .sort(); // Ordina alfabeticamente
    });
  }

  loadIngredients()
  {
    this.cocktailService.getIngredients().subscribe(response => {
      this.ingredients = response.drinks
        .map((i: any) => i.strIngredient1)
        .sort(); // Ordina alfabeticamente
    });
  }

  loadGlasses() {
    this.cocktailService.getGlasses().subscribe(response => {
      this.glasses = response.drinks.map((g: any) => g.strGlass).sort();
    });
  }

  onSearch()
  {
    this.cocktailService.searchCocktails(
      this.searchQuery,
      this.selectedCategory,
      this.selectedIngredient,
      this.selectedGlass
    ).subscribe(response => {
        this.drinks = response.drinks || [];
      });
  }
  ////////////////////////////
  // Localization Methods
  ////////////////////////////

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  //onLanguageChange(lang: string) {
  //  /*const lang = (event.target as HTMLSelectElement).value;*/
  //  this.translate.use(lang);
  //  this.currentLang = lang;
  //  this.dropdownOpen = false;
  //  localStorage.setItem('lang', lang);
  //}
  onLanguageChange(lang: string) {
    this.languageService.changeLanguage(lang); // <-- usa il parametro corretto
    this.currentLang = lang; // <-- aggiorna il valore locale
    this.dropdownOpen = false;
  }


}
