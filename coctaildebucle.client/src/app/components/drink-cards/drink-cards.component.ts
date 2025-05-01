import { Component, OnInit } from '@angular/core';
import { CocktailService } from '../../services/cocktail.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

/**
 * @brief : setting up interface for type safety
 */

export interface DrinkImportDTO {
  id: number;
  name: string;
  imageData: string;
  imageMimeType: string;
}

@Component({
  selector: 'app-drink-cards',
  standalone: true,
  templateUrl: './drink-cards.component.html',
  styleUrls: ['./drink-cards.component.css'],
  imports: [CommonModule, NgFor, RouterModule]
})
export class DrinkCardsComponent implements OnInit
{
  drinks: any[] = [];
  selDrinks: any[] = [];

  /**
   * 
   * @todo : get the full data from controller to selDrinks
   */

  constructor(private cocktailService: CocktailService, private router: Router) { }

  ngOnInit(): void
  {
    this.cocktailService.getActiveSelectionDrinks().subscribe({
      next: (data: DrinkImportDTO[]) => {
        this.selDrinks = data;
        this.selDrinks.forEach((value) => {
          console.log("selection drink: ", value);
        });
      },
      error: (err) => console.error('Failed to load drinks', err)
    });
  }

  //private getRandomDrinks(drinks: any[], count: number): any[]
  //{
  //  if (drinks.length <= count) return drinks;
  //  return drinks
  //    .sort(() => 0.5 - Math.random())
  //    .slice(0, count);
  //}

  goToDetails(id: string | undefined): void
  {
    if (!id) {
      console.error('Error: idDrink is undefined!');
      return;
    }
    console.log('Navigating to cocktail ID:', id);
    this.router.navigate(['/cocktail', id]);
  }
}
