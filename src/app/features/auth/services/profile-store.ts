import { computed, inject, Service, signal } from '@angular/core';
import { SessionStore } from '../../../core/auth/session-store';
import { UserProfileResponse } from '../models/auth-models';
import { AuthApi } from './auth-api';

// The signed-in account as /users/me describes it, for what the session keeps no copy of, like
// the avatar. Loaded once per account; a failure only leaves the initial in its place
@Service()
export class ProfileStore {
  private readonly api = inject(AuthApi);
  private readonly session = inject(SessionStore);

  private readonly profile = signal<UserProfileResponse['data'] | null>(null);
  private requestedFor: string | null = null;

  // Only the current account's, so signing out or in as someone else never shows the last photo
  readonly avatarUrl = computed(() => {
    const profile = this.profile();
    return profile && profile.id === this.session.user()?.id ? profile.avatarUrl : null;
  });

  load(): void {
    const userId = this.session.user()?.id;
    if (!userId || this.requestedFor === userId) return;
    this.requestedFor = userId;

    this.api.getCurrentProfile().subscribe({
      next: (response) => this.profile.set(response.data),
      error: () => (this.requestedFor = null),
    });
  }
}
