import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { GdprService } from '../../services/gdpr.service';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile-update-form',
  imports: [NgIf, NgFor, FormsModule, ReactiveFormsModule, TranslateModule,
            ButtonModule],
  templateUrl: './profile-update-form.component.html',
  styleUrl: './profile-update-form.component.css'
})
export class ProfileUpdateFormComponent implements OnInit {
  userId: number | null = null;
  profileForm!: FormGroup;
  passwordMismatch: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  editMode: boolean = false;
  passwordEditMode = false;
  consentGiven: boolean = false;

  editableFields = [
    { labelKey: 'USER_PROFILE.FIELD_NAME', controlName: 'name', type: 'text', editing: false },
    { labelKey: 'USER_PROFILE.FIELD_SURNAME', controlName: 'surname', type: 'text', editing: false },
    { labelKey: 'USER_PROFILE.FIELD_BIRTHDATE', controlName: 'birthDate', type: 'date', editing: false },
    { labelKey: 'USER_PROFILE.FIELD_USERNAME', controlName: 'username', type: 'text', editing: false },
    { labelKey: 'USER_PROFILE.FIELD_EMAIL', controlName: 'email', type: 'email', editing: false },
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private gdprService: GdprService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.initProfileForm();

    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.gdprService.getConsent(this.userId).subscribe(
        (response) => {
          this.consentGiven = response.gdprConsent;
          this.loadUserData(); // <-- solo dopo aver ricevuto il consenso
        },
        (error) => {
          console.error('Error fetching GDPR consent:', error);
          this.loadUserData(); // fallback: carica comunque i dati
        }
      );
    } else {
      console.error("User ID is null, cannot check consent");
    }
  }

  private initProfileForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      birthDate: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gdprConsent: [false],
      newPassword: [''],
      confirmNewPassword: ['']
    });
  }

  private loadUserData(): void {
    this.http.get<any>(`https://localhost:7047/api/auth/${this.userId}`).subscribe(user => {
      const date = new Date(user.birthDate);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;      
      this.profileForm.patchValue({
        name: user.name,
        surname: user.surname,
        birthDate: formattedDate,
        username: user.username,
        email: user.email,
        gdprConsent: this.consentGiven,
      });
    });
  }

  onProfileUpdate(): void {
    this.passwordMismatch = false;

    const newPass = this.profileForm.get('newPassword')?.value;
    const confirmPass = this.profileForm.get('confirmNewPassword')?.value;

    if (newPass && newPass !== confirmPass) {
      this.passwordMismatch = true;
      return;
    }

    const updateData: any = {
      name: this.profileForm.value.name,
      surname: this.profileForm.value.surname,
      birthDate: this.profileForm.value.birthDate,
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      gdprConsent: !!this.profileForm.value.gdprConsent,
      password: newPass || ""
    };

    this.successMessage = this.translate.instant('USER_PROFILE.SAVE_INFORMATION_CONFIRM');
    // Nasconde il messaggio dopo tot millisecondi
    setTimeout(() => this.successMessage = '', 2000);

    this.http.put(`https://localhost:7047/api/auth/update/${this.userId}`, updateData).subscribe({
      next: (response: any) => {
        console.log('Successo aggiornamento profilo:', response);
      },
      error: err => {
        console.error('Errore aggiornamento profilo:', err);
      }
    });


    this.consentGiven = this.profileForm.value.gdprConsent;
    window.location.reload();
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  togglePasswordEdit(): void {
    this.passwordEditMode = !this.passwordEditMode;
    if (!this.passwordEditMode) {
      this.profileForm.patchValue({ newPassword: '', confirmNewPassword: '' });
    }
  }

}
