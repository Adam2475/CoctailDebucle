import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: false,
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit
{
  favoriteDrinks: any[] = [];
  userId: number = 3; // Replace with dynamic user ID from authentication

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserFavorites();
  }

  loadUserFavorites() {
    this.userService.getUserFavorites(this.userId).subscribe(
      (drinks) => {
        this.favoriteDrinks = drinks;
      },
      (error) => {
        console.error('Error fetching favorites', error);
      }
    );
  }
}
