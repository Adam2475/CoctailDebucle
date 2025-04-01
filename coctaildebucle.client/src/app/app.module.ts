import { HttpClientModule } from '@angular/common/http';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonComponent } from './ts/button.component'
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { providePrimeNG } from 'primeng/config';
import { FormsModule } from '@angular/forms';
import Aura from '@primeng/themes/aura';
import { HeaderComponent } from './ts/header.component';
import { FooterComponent } from './ts/footer.component';
import { PopupFormComponent } from './ts/popup.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DrinkCardsComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, ButtonModule,
    FooterComponent, PopupFormComponent,
    AppRoutingModule, ButtonComponent, HeaderComponent,
    FormsModule, ReactiveFormsModule,
    BrowserModule, FormsModule,
    BrowserAnimationsModule, CocktailDetailComponent,
    ButtonModule,
    DialogModule, SignupComponent,
    InputTextModule
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
