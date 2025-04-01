import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { HeaderComponent } from './ts/header.component';
import { HomeComponent } from './components/home/home.component';
import { CocktailDetailComponent } from './components/cocktail-detail/cocktail-detail.component'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cocktail/:id', component: CocktailDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
