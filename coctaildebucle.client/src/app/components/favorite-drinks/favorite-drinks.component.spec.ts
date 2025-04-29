import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteDrinksComponent } from './favorite-drinks.component';

describe('FavoriteDrinksComponent', () => {
  let component: FavoriteDrinksComponent;
  let fixture: ComponentFixture<FavoriteDrinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteDrinksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteDrinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
