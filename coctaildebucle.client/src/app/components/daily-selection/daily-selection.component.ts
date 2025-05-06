import { Component } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { DrinkCardsComponent } from '../drink-cards/drink-cards.component';
import { BackButtonComponent } from '../back-button/back-button.component';

@Component({
  selector: 'app-daily-selection',
  imports: [DrinkCardsComponent, TranslateModule, BackButtonComponent],
  templateUrl: './daily-selection.component.html',
  styleUrl: './daily-selection.component.css'
})
export class DailySelectionComponent {

}
