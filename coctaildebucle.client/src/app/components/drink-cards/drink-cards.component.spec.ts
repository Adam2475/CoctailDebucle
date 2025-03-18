import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkCardsComponent } from './drink-cards.component';

describe('DrinkCardsComponent', () => {
  let component: DrinkCardsComponent;
  let fixture: ComponentFixture<DrinkCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrinkCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrinkCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
