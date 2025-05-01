import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from '../../services/language.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [ReactiveFormsModule, TranslateModule]
})
export class SignupComponent {
  registerForm: FormGroup;
  isSubmitted = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
    ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      BirthDate: ['', [Validators.required]]
    });
  }

  // Convenience getter for easy access to form fields
  get formControls() {
    return this.registerForm.controls as { [key: string]: any };
  }

  // Submit registration form
  onSubmit() {
    this.isSubmitted = true;

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // Send the registration data to the backend
    const registerData = {
      username: this.formControls['username'].value,
      email: this.formControls['email'].value,
      password: this.formControls['password'].value,
      name: this.formControls['name'].value,
      surname: this.formControls['surname'].value,
      BirthDate: this.formControls['BirthDate'].value
    };

    this.http.post('https://localhost:7047/api/auth/register', registerData)
      .subscribe(
        response => {
          console.log('Registration successful!', response);

          // popup translated success message
          this.translate.get('SIGNUP_COMPONENT.REGISTER_SUCCESS').subscribe((translatedMessage: string) => {
            window.alert(translatedMessage);
          });

          // redirect to home page
          this.router.navigate(['/']);
        },
        error => {
          console.error('Registration error', error);
          this.errorMessage = 'Registration failed. Please try again.';
        }
      );

  }
}
