import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'button-demo',
  template: `<button>Click Me</button>`,
  //template: `<button pButton label="Click Me"></button>`, 
  //template: `<button pButton label="Click Me">ciao</button>`,
  //templateUrl: './button.component.html',
  standalone: true, 
  imports: [CommonModule, ButtonModule]
})
export class ButtonComponent {
}























