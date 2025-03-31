import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']); // 🔥 Simula il Router

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy } // 🔥 Usa il finto Router
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow access if user is logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-token'); // 🔥 Simula utente loggato

    expect(authGuard.canActivate()).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled(); // 🔥 Non deve reindirizzare
  });

  it('should deny access and redirect if user is not logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); // 🔥 Simula utente NON loggato

    expect(authGuard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']); // 🔥 Deve reindirizzare
  });
});
