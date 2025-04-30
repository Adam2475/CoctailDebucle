import { HttpClientModule } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { providePrimeNG } from 'primeng/config';
import { FormsModule } from '@angular/forms';
import Material from '@primeng/themes/material';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Nora from '@primeng/themes/nora';
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
import { AdminComponent } from './components/admin/admin.component';
import { FavoriteDrinksComponent } from './components/favorite-drinks/favorite-drinks.component';
import { RouterModule } from '@angular/router';
///////////////////////////////////////////////////
// Ngx Translate
///////////////////////////////////////////////////
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
/*import { provideTranslateService } from "@ngx-translate/core";*/

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, ButtonModule,
    FooterComponent, PopupFormComponent,
    AppRoutingModule, HeaderComponent, CommonModule,
    FormsModule, ReactiveFormsModule, RouterModule,
    BrowserModule, FormsModule, AdminComponent,
    BrowserAnimationsModule, CocktailDetailComponent,
    ButtonModule, HomeComponent, DrinkCardsComponent,
    DialogModule, SignupComponent, FavoriteDrinksComponent,
    InputTextModule, GdprBannerComponent, UserProfileComponent,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    CocktailService, // Added cocktail service to providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme:
      {
        preset: Material
      }
    }),
/*    provideHttpClient(withInterceptorsFromDi())*/
  ], // updated the provider
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
//export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
//  return new TranslateHttpLoader(http, './i18n/', '.json');
//}
