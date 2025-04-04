import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprBannerComponent } from './gdpr.component';

describe('GdprComponent', () => {
  let component: GdprBannerComponent;
  let fixture: ComponentFixture<GdprBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GdprBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GdprBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
