import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-back-button',
  imports: [TranslateModule],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.css'
})
export class BackButtonComponent {

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back(); // Navigate back to the previous page
  }
}
