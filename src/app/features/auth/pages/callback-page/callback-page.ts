import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { AuthRedirect } from '../../../../core/auth/auth-redirect';
import { SessionStore } from '../../../../core/auth/session-store';
import { discordIcon } from '../../../../shared/icons/brand-icons';
import { DiscordButton } from '../../../../shared/ui/discord-button/discord-button';
import { AuthApi } from '../../services/auth-api';

// Where Discord sends the user back: ?token= on success, ?error= when they cancel or it fails
@Component({
  selector: 'app-callback-page',
  imports: [RouterLink, NgIcon, HlmButton, DiscordButton],
  templateUrl: './callback-page.html',
  viewProviders: [provideIcons({ discordIcon })],
})
export class CallbackPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authApi = inject(AuthApi);
  private sessionStore = inject(SessionStore);
  private authRedirect = inject(AuthRedirect);

  protected readonly status = signal<'processing' | 'failed'>('processing');

  // Pressing Cancel on Discord reads differently from a link that broke on the way back
  protected readonly canceled = signal(false);

  async ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    const token = params.get('token');
    const error = params.get('error');

    // The token is a credential: out of the address bar and the history before anything else
    await this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    if (error || !token) {
      this.canceled.set(error === 'access_denied');
      this.status.set('failed');
      return;
    }

    // Asking for the profile with it is what proves the token is real
    this.authApi.getProfile(token).subscribe({
      next: ({ data }) => {
        this.sessionStore.setSession(
          {
            id: data.id,
            email: data.email,
            name: data.displayName,
            roles: [data.roleName.toLowerCase()],
          },
          token,
        );
        // Replaces this page in the history too, so going back never lands on it again
        this.router.navigateByUrl(this.authRedirect.consume(), { replaceUrl: true });
      },
      error: () => this.status.set('failed'),
    });
  }
}
