import { HttpClientModule } from '@angular/common/http';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { providePrimeNG } from 'primeng/config';
import { FormsModule } from '@angular/forms';
import Aura from '@primeng/themes/aura';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './components/signup/signup.component';
import { CocktailService } from './services/cocktail.service'; 
// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './components/home/home.component';
import { DrinkCardsComponent } from './components/drink-cards/drink-cards.component';
import { CocktailDetailComponent } from './components/cocktail-detail/cocktail-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { GdprBannerComponent } from './components/gdpr/gdpr.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PopupFormComponent } from './components/popup/popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DrinkCardsComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, ButtonModule,
    FooterComponent, PopupFormComponent,
    AppRoutingModule, HeaderComponent,
    FormsModule, ReactiveFormsModule,
    BrowserModule, FormsModule,
    BrowserAnimationsModule, CocktailDetailComponent,
    ButtonModule,
    DialogModule, SignupComponent,
    InputTextModule, GdprBannerComponent, UserProfileComponent,
  ],
  providers: [
    CocktailService, // Added cocktail service to providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    providePrimeNG({
    theme: {
      preset: Aura
    }
  })], // updated the provider
  bootstrap: [AppComponent]
})
export class AppModule { }
