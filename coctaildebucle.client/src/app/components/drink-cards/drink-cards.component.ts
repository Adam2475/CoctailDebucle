import { Component, OnInit } from '@angular/core';
import { CocktailService } from '../../services/cocktail.service';

@Component({
  selector: 'app-drink-cards',
  standalone: false,
  templateUrl: './drink-cards.component.html',
  styleUrls: ['./drink-cards.component.css']
})
export class DrinkCardsComponent implements OnInit
{
  drinks: any[] = []; // Array to hold drink data

  constructor(private cocktailService: CocktailService) { }

  ngOnInit(): void
  {
    // Make sure your API call returns the expected data structure
    this.cocktailService.getDrinks().subscribe((data: any) =>
    {
      this.drinks = data.drinks; // Adjust based on your API response structure
    }, error => {
      console.error('Error fetching drinks:', error);
    });
  }
}
