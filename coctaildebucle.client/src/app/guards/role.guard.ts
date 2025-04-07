import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  return authService.getUser().pipe(
    map(user => {
      console.log (user.Role)
      // Check if the user's Role property is greater than 0 (admin)
      if (user && user.Role > 0) {
        return true;
      }
      return router.parseUrl('');
    })
  );
};
