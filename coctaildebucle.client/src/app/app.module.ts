import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonComponent } from './ts/button.component'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { providePrimeNG } from 'primeng/config';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule
import Aura from '@primeng/themes/aura';
import { HeaderComponent } from './ts/header.component';
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from './ts/footer.component';
import { PopupFormComponent } from './ts/popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule, ButtonModule,
    FooterComponent, PopupFormComponent,
    AppRoutingModule, ButtonComponent, HeaderComponent,
    FormsModule, ReactiveFormsModule, LoginComponent,
    SignupComponent
  ],
  providers: [providePrimeNG()], // updated the provider
  bootstrap: [AppComponent]
})
export class AppModule { }
