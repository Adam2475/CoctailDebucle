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
import { ProjectsComponent } from './components/projects/projects.component';
import { ServicesComponent } from './components/services/services.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { DailySelectionComponent } from './components/daily-selection/daily-selection.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cocktail/:id', component: CocktailDetailComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  /*  { path: 'admin', component: UserProfileComponent, canActivate: [AuthGuard] },*/
  { path: 'admin', component: AdminComponent, canActivate: [roleGuard] },
  { path: 'projects', component: ProjectsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'daily-selection', component: DailySelectionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
