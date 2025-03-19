import { HttpClientModule } from '@angular/common/http';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonComponent } from './ts/button.component'
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { providePrimeNG } from 'primeng/config';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule
import Aura from '@primeng/themes/aura';
import { HeaderComponent } from './ts/header.component';
import { FooterComponent } from './ts/footer.component';
import { PopupFormComponent } from './ts/popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './components/signup/signup.component'; // Circular dependency (?)

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './components/home/home.component';
import { DrinkCardsComponent } from './components/drink-cards/drink-cards.component';
import { CocktailDetailComponent } from './components/cocktail-detail/cocktail-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    HomeComponent,
    DrinkCardsComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, ButtonModule,
    FooterComponent, PopupFormComponent,
    AppRoutingModule, ButtonComponent, HeaderComponent,
    FormsModule, ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule, CocktailDetailComponent,
    ButtonModule,
    DialogModule,
    InputTextModule
  ],
  providers: [
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
