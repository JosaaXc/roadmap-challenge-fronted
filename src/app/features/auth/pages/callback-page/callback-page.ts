import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApi } from '../../services/auth-api';
import { SessionStore, SessionUser } from '../../../../core/auth/session-store';

@Component({
  selector: 'app-callback-page',
  standalone: true,
  templateUrl: './callback-page.html',
})
export class CallbackPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authApi = inject(AuthApi);
  private sessionStore = inject(SessionStore);

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authApi.refreshToken().subscribe({
        next: (response) => {
          const backendUser = response.data.user;
          const mappedUser: SessionUser = {
            id: backendUser.id,
            email: backendUser.email,
            name: backendUser.displayName,
            roles: [backendUser.roleName.toLowerCase()],
          };

          this.sessionStore.setSession(mappedUser, response.data.accessToken);
          this.router.navigate(['/cuestionario']);
        },
        error: () => {
          this.router.navigate(['/auth/login']);
        },
      });
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
