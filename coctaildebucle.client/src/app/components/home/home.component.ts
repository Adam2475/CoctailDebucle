import { Component } from '@angular/core';
import { DrinkCardsComponent } from '../drink-cards/drink-cards.component'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CocktailService } from '../../services/cocktail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
{
  searchQuery: string = '';
  drinks: any[] = [];
  isLoggedIn: boolean = false;
  // Injecting the service into the constructor.
  constructor(private http: HttpClient, private cocktailService: CocktailService, private router: Router) { }

  ngOnInit() {
    this.checkLogin();
  }

  checkLogin() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  // Optionally, create a logout method to remove the token.
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

  onSearch()
  {
    if (this.searchQuery.length > 2)
    {
      this.cocktailService.getCocktailByName(this.searchQuery).subscribe(response => {
        this.drinks = response.drinks || [];
      });
    }
    else
    {
      this.drinks = [];
    }
  }
}
