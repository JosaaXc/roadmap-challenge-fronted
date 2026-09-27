import { Component, DOCUMENT, inject, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { environment } from '../../../../environments/environment';
import { AuthRedirect } from '../../../core/auth/auth-redirect';
import { discordIcon } from '../../icons/brand-icons';

// The API answers this URL with a redirect to Discord, so the browser has to go
// there as a page navigation: an XHR would be stopped by CORS at the redirect
const DISCORD_LOGIN_URL = `${environment.apiUrl}/auth/discord`;

// Every page offers the same Discord button, so the flow lives in one place
@Component({
  imports: [NgIcon, HlmButton],
  selector: 'app-discord-button',
  templateUrl: './discord-button.html',
  viewProviders: [provideIcons({ discordIcon })],
  // A block box, not `contents`: consumers space it with margins and a box-less host would drop them
  host: { class: 'block', '(window:pageshow)': 'onPageShow($event)' },
})
export class DiscordButton {
  private readonly document = inject(DOCUMENT);
  private readonly authRedirect = inject(AuthRedirect);

  readonly label = input('Continuar con Discord');

  // The page the login interrupted, so the callback can return to it once Discord answers
  readonly redirectTo = input<string | null>(null);

  // Locked from the first click: Discord is a full page away, and a second click would
  // start a second authorization
  protected readonly connecting = signal(false);

  protected start(): void {
    if (this.connecting()) return;

    this.connecting.set(true);
    this.authRedirect.remember(this.redirectTo());
    this.document.location.href = DISCORD_LOGIN_URL;
  }

  // The back button can restore this page exactly as it was left, button still locked
  protected onPageShow(event: PageTransitionEvent): void {
    if (event.persisted) this.connecting.set(false);
  }
}
