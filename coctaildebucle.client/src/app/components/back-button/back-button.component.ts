import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// Ng Prime UI
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-back-button',
  imports: [TranslateModule, ButtonModule],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.css'
})
export class BackButtonComponent {

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back(); // Navigate back to the previous page
  }
}
