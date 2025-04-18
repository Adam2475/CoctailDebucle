import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { CocktailDetailComponent } from './components/cocktail-detail/cocktail-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cocktail/:id', component: CocktailDetailComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  /*  { path: 'admin', component: UserProfileComponent, canActivate: [AuthGuard] },*/
  { path: 'admin', component: AdminComponent, canActivate: [roleGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
