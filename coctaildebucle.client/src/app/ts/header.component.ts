import { Component, ViewChild, OnInit } from '@angular/core';
import { PopupFormComponent } from '../ts/popup.component';
import { Router } from '@angular/router';  // Import Router for navigation
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PopupFormComponent, NgIf, CommonModule],
  templateUrl: '../html/header.component.html',
  styleUrls: ['../css/header.component.css'],
})

export class HeaderComponent
{
  @ViewChild(PopupFormComponent) popupForm!: PopupFormComponent; // Access PopupFormComponent
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Subscribe to login state changes
    //this.authService.isLoggedIn$.subscribe(status => {
    //  this.isLoggedIn = status;
    //});
  }


  //logout() {
  //  this.authService.logout();
  //}
}
