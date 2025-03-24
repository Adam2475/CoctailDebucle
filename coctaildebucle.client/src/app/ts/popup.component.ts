import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-popup-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,
    DividerModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogModule, FormsModule,
    InputTextModule],
  templateUrl: '../html/popup.component.html',
  styleUrls: ['../css/popup.component.css']
})
export class PopupFormComponent
{
  popupForm: FormGroup; // to store Form data
  isVisible: boolean = false;
  username = '';
  password = '';

  constructor(private router: Router, private authService: AuthService)
  {
      this.popupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void
  {
    if (this.popupForm.valid) {
      console.log(this.popupForm.value);
    } else {
      console.log("Form is invalid");
    }
  }

  togglePopup(): void {
    this.isVisible = !this.isVisible;
    // Debug
    /* console.log(`Popup visibility: ${this.isVisible}`);*/
  }

  navigateToSignup()
  {
    this.togglePopup();
    this.router.navigate(['/signup']);
  }

  login() {
    this.authService.login({ username: this.username, password: this.password })
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        console.log('Login successful');
      });
  }
}
