import { redirectUnauthorizedTo, redirectLoggedInTo, customClaims } from '@angular/fire/auth-guard';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

const ACCEPT = {
  ADMIN: () => pipe(customClaims, map(claims => claims.role === 'admin')),
  USER: () => redirectLoggedInTo(['courses']),
}

const REJECT = {
  UNAUTHORIZED: () => redirectUnauthorizedTo(['']),
}

export { ACCEPT, REJECT }
