import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from './ts/button.component'

@Component({
  selector: 'app-root',
  templateUrl: './html/app.component.html',
  standalone: false,
  styleUrl: './css/app.component.css'
})

export class AppComponent implements OnInit
{
  isVisible: boolean = false;

  showDialog() {
    this.isVisible = true;
  }

  constructor(private http: HttpClient) {}

  ngOnInit()
  {
    console.log("app is working");
  }

  title = 'coctaildebucle.client';
}
