import { Service } from '@angular/core';
import { isReturnPath } from './utils/return-path';

const STORAGE_KEY = 'cq:auth-redirect';
const DEFAULT_TARGET = '/mis-rutas';

// Where the user was headed when the login got in the way. It lives in sessionStorage
// because the Discord flow leaves the app and comes back as a brand new page
@Service()
export class AuthRedirect {
  // Called on the way out to Discord. Anything that is not a page of this app is ignored
  remember(url: string | null): void {
    if (!isReturnPath(url)) return;

    try {
      sessionStorage.setItem(STORAGE_KEY, url);
    } catch {
      // Without storage the login still works, it just ends on the default page
    }
  }

  // The page to open after a successful login, used once. The query parameter wins over
  // the stored target, since it belongs to the visit happening right now
  consume(fromQuery: string | null = null, fallback = DEFAULT_TARGET): string {
    let stored: string | null = null;

    try {
      stored = sessionStorage.getItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Same as above: no storage, so no target to return to
    }

    if (isReturnPath(fromQuery)) return fromQuery;
    return isReturnPath(stored) ? stored : fallback;
  }
}
