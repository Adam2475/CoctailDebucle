import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { PopupFormComponent } from '../popup/popup.component';
import { Router, NavigationEnd } from '@angular/router';  // Import Router for navigation
import { NgIf, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TranslateModule } from '@ngx-translate/core';
//import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    PopupFormComponent,
    NgIf, NgFor,
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
  /////////////////////////
  // Language Dropdown
  /////////////////////////
  availableLanguages: string[] = [];
  currentLang: string = 'en';
  dropdownOpen = false;

  constructor(private authService: AuthService, private languageService: LanguageService, private router: Router) { }

  ngOnInit() {
    this.checkLogin();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });

    this.availableLanguages = this.languageService.getAvailableLanguages();
    this.currentLang = this.languageService.getCurrentLang();
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
    this.authService.logout();
    this.router.navigate(['/']);

    console.log('Header component received logout event.');
  }

  ////////////////////////////
  // Localization Methods
  ////////////////////////////

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  //onLanguageChange(lang: string) {
  //  /*const lang = (event.target as HTMLSelectElement).value;*/
  //  this.translate.use(lang);
  //  this.currentLang = lang;
  //  this.dropdownOpen = false;
  //  localStorage.setItem('lang', lang);
  //}
  onLanguageChange(lang: string) {
    this.languageService.changeLanguage(lang); // <-- usa il parametro corretto
    this.currentLang = lang; // <-- aggiorna il valore locale
    this.dropdownOpen = false;
  }

}
