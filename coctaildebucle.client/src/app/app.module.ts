import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonComponent } from './ts/button.component'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { HeaderComponent } from './ts/header.component';
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from './ts/footer.component'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ButtonModule, FooterComponent,
    AppRoutingModule, ButtonComponent, HeaderComponent
  ],
  providers: [providePrimeNG()], // updated the provider
  bootstrap: [AppComponent]
})
export class AppModule { }
