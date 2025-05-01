import { Component, EventEmitter, Output } from '@angular/core';
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
import { AuthService } from '../../services/auth.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-popup-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,
    DividerModule, 
    BrowserAnimationsModule,
    ButtonModule, InputGroupModule, InputGroupAddonModule,
    DialogModule, FormsModule,
    InputTextModule,
    TranslateModule
    ],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupFormComponent
{
  @Output() loginSuccessful: EventEmitter<string> = new EventEmitter<string>();
  @Output() logoutSuccessful: EventEmitter<void> = new EventEmitter<void>();
  popupForm: FormGroup; // to store Form data
  isVisible: boolean = false;
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService, private http: HttpClient)
  {
    this.popupForm = new FormGroup(
      {
          username: new FormControl('', Validators.required),
          email: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', Validators.required),
      }
    );
  }

  onSubmit(): void
  {
    if (this.popupForm.valid)
      console.log(this.popupForm.value);
    else
      console.log("Form is invalid");
  }

  togglePopup(): void
  {
    this.isVisible = !this.isVisible;
  }

  navigateToSignup()
  {
    this.togglePopup();
    this.router.navigate(['/signup']);
  }

  login()
  {
    this.authService.login({ username: this.username, password: this.password })
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({ id: response.userId })); // Store userId (if provided in response)
        /*console.log(response.user);*/
        console.log('Login successful');
        //console.log(response.token);
        // Emit the token so the header can react
        this.loginSuccessful.emit(response.token);
        this.isVisible = !this.isVisible;
        window.location.reload();
      }, error => {
        console.error('Login failed:', error);
      });
  }

  logout()
  {
    // Clear token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    console.log('Logout successful');
    // Emit the logout event so the header can update its state
    this.logoutSuccessful.emit();
    window.location.reload();
  }
}
