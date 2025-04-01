import { Component } from '@angular/core';
import { DrinkCardsComponent } from '../drink-cards/drink-cards.component'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CocktailService } from '../../services/cocktail.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchQuery: string = '';
  drinks: any[] = [];
  categories: string[] = [];
  ingredients: string[] = [];
  glasses: string[] = [];
  selectedCategory: string = '';
  selectedIngredient: string = '';
  selectedGlass: string = '';
  isLoggedIn: boolean = false;


  constructor(private http: HttpClient, private cocktailService: CocktailService, private router: Router) { }

  ngOnInit() {
    this.checkLogin();
    this.loadCategories();
    this.loadIngredients();
    this.loadGlasses();
  }

  checkLogin() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    // Optionally, navigate to the login or home page.
  }

  // Navigate to the user's personal page.
  navigateToProfile() {
    // e.g., using the router to navigate to '/profile'
    this.router.navigate(['/profile']);
  }

  searchDrinks(query: string): Observable<any>
  {
    const url = `https://yourapi.com/api/cocktail?name=${query}`;
    return this.http.get<any>(url);
  }

  loadCategories() {
    this.cocktailService.getCategories().subscribe(response => {
      this.categories = response.drinks
        .map((c: any) => c.strCategory)
        .sort(); // Ordina alfabeticamente
    });
  }

  loadIngredients() {
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

  onSearch() {
    this.cocktailService.searchCocktails(
      this.searchQuery,
      this.selectedCategory,
      this.selectedIngredient,
      this.selectedGlass
    ).subscribe(response => {
        this.drinks = response.drinks || [];
      });
  }
}
