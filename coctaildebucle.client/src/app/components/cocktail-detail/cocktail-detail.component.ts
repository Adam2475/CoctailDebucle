import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CocktailService } from '../../services/cocktail.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  templateUrl: './cocktail-detail.component.html',
  imports: [NgIf, NgFor],
  styleUrls: ['./cocktail-detail.component.css']
})
export class CocktailDetailComponent implements OnInit {
  drink: any; // Holds the cocktail details

  constructor(
    private route: ActivatedRoute,
    private cocktailService: CocktailService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Get ID from URL
    if (id) {
      this.cocktailService.getDrinkById(id).subscribe((data: any) => {
        if (data.drinks && data.drinks.length > 0) {
          this.drink = data.drinks[0]; // API returns an array
        }
      }, error => {
        console.error('Error fetching drink details:', error);
      });
    }
  }

  getIngredients(): string[] {
    let ingredients: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = this.drink[`strIngredient${i}`];
      const measure = this.drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(measure ? `${measure} ${ingredient}` : ingredient);
      }
    }
    return ingredients;
  }

  goBack(): void {
    window.history.back(); // Navigate back
  }
}
