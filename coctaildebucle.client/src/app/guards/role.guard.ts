import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Return the observable so it can be handled asynchronously
  return authService.getUser().pipe(
    map(user => {
      if (user && user.role > 0) {
        // User is an admin
/*        console.log("User is admin: ", user);*/
        return true; // Allow access
      } else {
        // User is not an admin
        console.log("User is not admin");
        return router.parseUrl(''); // Redirect to a different page (e.g., homepage)
      }
    })
  );
};
