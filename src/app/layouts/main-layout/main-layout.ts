import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BrandLogo } from '../../shared/ui/brand-logo/brand-logo';
import { AuthStore } from '../../features/auth/services/auth-store';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BrandLogo],
  standalone: true,
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
})
export class MainLayout {
  authStore = inject(AuthStore);
}
