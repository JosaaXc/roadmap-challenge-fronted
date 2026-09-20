import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { environment } from '../../../../environments/environment';
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
  host: { class: 'block' },
})
export class DiscordButton {
  start(): void {
    window.location.href = DISCORD_LOGIN_URL;
  }
}
