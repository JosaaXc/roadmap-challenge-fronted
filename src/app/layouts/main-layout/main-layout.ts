import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../features/auth/services/auth-store';
import { GlassHeader } from '../../shared/ui/glass-header/glass-header';
import { PageLight } from '../../shared/ui/page-light/page-light';
import { UserAvatarMenuComponent } from '../../shared/ui/user-avatar-menu/user-avatar-menu';
import { SessionStore } from '../../core/auth/session-store';

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    GlassHeader,
    PageLight,
    UserAvatarMenuComponent,
  ],
  standalone: true,
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
})
export class MainLayout {
  authStore = inject(AuthStore);
  sessionStore = inject(SessionStore);
}
