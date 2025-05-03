import { Component, OnInit } from '@angular/core';
import { CocktailService } from '../../services/cocktail.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from '../../services/language.service';
import { CardModule } from 'primeng/card';
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

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
  imports: [CommonModule, NgFor, RouterModule,
            CardModule, TranslateModule]
})
export class DrinkCardsComponent implements OnInit
{
  drinks: any[] = [];
  // Drinks for the selection list
  selDrinks: any[] = [];

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
