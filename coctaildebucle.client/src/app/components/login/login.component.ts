import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  popupForm: FormGroup;
  @Input() isVisible: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    // Initialize the form group with form controls and their validators
    this.popupForm = new FormGroup({
      username: new FormControl('', Validators.required),  // Username is required
      email: new FormControl('', [Validators.required, Validators.email]),  // Email is required and should be valid
      password: new FormControl('', Validators.required),  // Password is required
    });
  }

  ngOnInit(): void {
    // Get the current navigation state (for capturing the state from the previous route)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.isVisible = navigation.extras.state['isPopupVisible'];  // Retrieve the state passed during navigation
    }
  }

  onSubmit(): void {
    if (this.popupForm.valid) {
      console.log(this.popupForm.value);
    } else {
      console.log("Form is invalid");
    }
  }

  togglePopup(): void {
    this.isVisible = !this.isVisible;
    console.log(`Popup visibility: ${this.isVisible}`);
  }
}
