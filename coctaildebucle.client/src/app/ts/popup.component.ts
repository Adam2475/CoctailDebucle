import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
    InputTextModule,
    ],
  templateUrl: '../html/popup.component.html',
  styleUrls: ['../css/popup.component.css']
})
export class PopupFormComponent
{
  popupForm: FormGroup; // to store Form data
  isVisible: boolean = false;
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService, private http: HttpClient)
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

  //login() {
  //  // Replace 'your-api-endpoint' with your actual backend login URL
  //  this.http.post<{ token: string }>('http://localhost:5000/api/auth/login', {
  //    username: this.username,
  //    password: this.password
  //  }).subscribe({
  //    next: (response) => {
  //      const tokenFromBackend = response.token; // Extract token from response
  //      this.authService.login(tokenFromBackend); // Store token and update UI
  //    },
  //    error: (error) => {
  //      this.errorMessage = 'Login failed! Please check your credentials.';
  //      console.error('Login error:', error);
  //    }
  //  });
  //}

 login() {
    this.authService.login({ username: this.username, password: this.password })
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        console.log('Login successful');
        // Optionally, update a shared login state or emit an event
      }, error => {
        console.error('Login failed:', error);
      });
  }
}
