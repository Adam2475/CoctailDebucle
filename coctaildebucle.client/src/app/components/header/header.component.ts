import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { PopupFormComponent } from '../popup/popup.component';
import { Router, NavigationEnd } from '@angular/router';  // Import Router for navigation
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    PopupFormComponent,
    NgIf,
    CommonModule,
    ButtonModule,
    MenubarModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent implements OnInit, AfterViewInit
{
  @ViewChild(PopupFormComponent) popupForm!: PopupFormComponent; // Access PopupFormComponent
  isLoggedIn: boolean = false;
  currentUrl: string = '';
  token: string = '';
  isAdmin: boolean = false;
  showNavDropdown: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.checkLogin();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  toggleNavDropdown() {
    this.showNavDropdown = !this.showNavDropdown;
  }

  ngAfterViewInit() {
    this.checkAdminStatus(); 
  }

  // Check if the logged-in user is an admin
  checkAdminStatus() {
    if (this.isLoggedIn) {
      this.authService.getUser().subscribe(user => {
        if (user.role > 0) {
          this.isAdmin = true; // User is an admin
        } else {
          this.isAdmin = false; // User is not an admin
          console.log("User is not an admin!");
        }
      });
    }
  }

  checkLogin() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  // Navigate to User profile page
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  // Navigate to Admin profile page
  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }

  handleLogin(token: string): void
  {
    this.token = token;
    this.isLoggedIn = true;
    console.log('Token received in header:', token);
    this.checkAdminStatus(); 
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
