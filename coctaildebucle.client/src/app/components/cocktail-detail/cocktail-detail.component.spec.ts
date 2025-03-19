import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailDetailComponent } from './cocktail-detail.component';

describe('CocktailDetailComponent', () => {
  let component: CocktailDetailComponent;
  let fixture: ComponentFixture<CocktailDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CocktailDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
