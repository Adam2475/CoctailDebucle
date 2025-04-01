import { Component, ViewChild, OnInit } from '@angular/core';
import { PopupFormComponent } from '../ts/popup.component';
import { Router, NavigationEnd } from '@angular/router';  // Import Router for navigation
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
  currentUrl: string = '';
  token: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.checkLogin();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  checkLogin() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  navigateToProfile() {
    this.router.navigate(['/profile']); // 🔥 Porta alla pagina utente
  }

  handleLogin(token: string): void
  {
    this.token = token;
    this.isLoggedIn = true;
    // Additional logic can go here, such as notifying other parts of the app
    console.log('Token received in header:', token);
  }

  handleLogout(): void
  {
    this.token = '';
    this.isLoggedIn = false;
    console.log('Header component received logout event.');

    //aggiungi altre pagine accessibili solo se loggati
    if (this.currentUrl === '/profile') {
      this.router.navigate(['/']);
    }
  }
}
