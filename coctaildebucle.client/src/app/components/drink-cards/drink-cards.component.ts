import { Component, OnInit } from '@angular/core';
import { CocktailService } from '../../services/cocktail.service';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drink-cards',
  standalone: true,
  templateUrl: './drink-cards.component.html',
  styleUrls: ['./drink-cards.component.css'],
  imports: [CommonModule, NgFor]
})
export class DrinkCardsComponent implements OnInit
{
  drinks: any[] = []; // Array to hold drink data
  selDrinks: any[] = [];

  constructor(private cocktailService: CocktailService, private router: Router) { }

  ngOnInit(): void {


    this.cocktailService.getDrinks().subscribe((data: any) => {
      if (data.drinks && data.drinks.length > 0) {
        this.drinks = this.getRandomDrinks(data.drinks, 9);
      }
    }, error => {
      console.error('Error fetching drinks:', error);
    });
    this.cocktailService.getActiveSelectionDrinks().subscribe({
      next: (data) => this.selDrinks = data,
      error: (err) => console.error('Failed to load drinks', err)
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
