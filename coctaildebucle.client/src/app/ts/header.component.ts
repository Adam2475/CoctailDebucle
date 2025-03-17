import { Component, ViewChild } from '@angular/core';
import { PopupFormComponent } from '../ts/popup.component';
import { LoginComponent } from '../components/login/login.component';
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PopupFormComponent, LoginComponent],
  templateUrl: '../html/header.component.html',
  styleUrls: ['../css/header.component.css'],
})

export class HeaderComponent {
  @ViewChild(PopupFormComponent) popupForm!: PopupFormComponent; // Access PopupFormComponent
}
