import { HttpContextToken } from '@angular/common/http';

// For requests whose 401 is an answer, not an expired session: the error interceptor then
// neither refreshes nor sends the user to the login, and the caller handles it
export const SKIP_SESSION_RECOVERY = new HttpContextToken<boolean>(() => false);
