import { Component } from '@angular/core';
import { DrinkCardsComponent } from '../drink-cards/drink-cards.component'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CocktailService } from '../../services/cocktail.service';

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

  // Injecting the service into the constructor.
  constructor(private http: HttpClient, private cocktailService: CocktailService) {}

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
