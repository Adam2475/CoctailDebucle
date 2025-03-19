import { Component, OnInit } from '@angular/core';
import { CocktailService } from '../../services/cocktail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drink-cards',
  standalone: false,
  templateUrl: './drink-cards.component.html',
  styleUrls: ['./drink-cards.component.css']
})
export class DrinkCardsComponent implements OnInit
{
  drinks: any[] = []; // Array to hold drink data

  constructor(private cocktailService: CocktailService, private router: Router) { }

  ngOnInit(): void {
    this.cocktailService.getDrinks().subscribe((data: any) => {
      if (data.drinks && data.drinks.length > 0) {
        this.drinks = this.getRandomDrinks(data.drinks, 9);
      }
    }, error => {
      console.error('Error fetching drinks:', error);
    });
  }

  private getRandomDrinks(drinks: any[], count: number): any[] {
    if (drinks.length <= count) return drinks; // Return all if less than 9

    return drinks
      .sort(() => 0.5 - Math.random()) // Shuffle array
      .slice(0, count); // Get first `count` elements
  }

  goToDetails(id: string | undefined): void {
    if (!id) {
      console.error('Error: idDrink is undefined!');
      return;
    }
    console.log('Navigating to cocktail ID:', id);
    this.router.navigate(['/cocktail', id]);
  }
}
