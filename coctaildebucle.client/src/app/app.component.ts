import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
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
    /*console.log("app is working");*/
  }

  title = 'coctaildebucle.client';
}
