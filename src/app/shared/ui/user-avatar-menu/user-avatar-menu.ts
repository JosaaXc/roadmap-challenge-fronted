import { Component, computed, inject } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideKeyRound } from "@ng-icons/lucide";
import { HlmAvatarImports } from "@spartan-ng/helm/avatar";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmDropdownMenuImports } from "@spartan-ng/helm/dropdown-menu";
import { SessionStore } from "../../../core/auth/session-store";
import { ChangePasswordDialog } from "../../../features/auth/components/change-password-dialog/change-password-dialog";
import { AuthStore } from "../../../features/auth/services/auth-store";
import { ProfileStore } from "../../../features/auth/services/profile-store";

@Component({
  selector: 'app-user-avatar-menu',
  standalone: true,
  imports: [HlmAvatarImports, HlmDropdownMenuImports, HlmButtonImports, NgIcon, ChangePasswordDialog],
  templateUrl: './user-avatar-menu.html',
  viewProviders: [provideIcons({ lucideKeyRound })],
})
export class UserAvatarMenuComponent {
  readonly sessionStore = inject(SessionStore);
  readonly authStore = inject(AuthStore);
  readonly profileStore = inject(ProfileStore);

  readonly userInitial = computed(() => {
    const name = this.sessionStore.user()?.name || '';
    return name ? name.charAt(0).toUpperCase() : 'A';
  });

  constructor() {
    // The photo comes from the profile; until it arrives, or without one, the initial stands in
    this.profileStore.load();
  }
}
