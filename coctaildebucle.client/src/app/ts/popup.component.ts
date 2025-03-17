import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-popup-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: '../html/popup.component.html',
  styleUrls: ['../css/popup.component.css']
})
export class PopupFormComponent {
  popupForm: FormGroup;
  isVisible: boolean = false; // Track visibility of the popup form

  constructor() {
    this.popupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void {
    if (this.popupForm.valid) {
      console.log(this.popupForm.value);
    } else {
      console.log("Form is invalid");
    }
  }

  // Toggle the popup visibility
  togglePopup(): void {
    this.isVisible = !this.isVisible;
    console.log(`Popup visibility: ${this.isVisible}`);
  }
}


//export class PopupFormComponent
//{
//  isPopupOpen: boolean = false;
//  username: string = '';
//  email: string = '';
//  password: string = '';

//  // Toggle Popup
//  togglePopup()
//  {
//    console.log('togglePopup called'); 
//    this.isPopupOpen = !this.isPopupOpen;
//  }

//  // Close Popup when clicking outside
//  closePopup(event: MouseEvent) {
//    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
//      this.isPopupOpen = false;
//    }
//  }

//  // Form Submission (Replace with API call)
//  registerUser() {
//    console.log('User Registered:', { username: this.username, email: this.email });
//    this.isPopupOpen = false; // Close popup after registering
//  }
//}
