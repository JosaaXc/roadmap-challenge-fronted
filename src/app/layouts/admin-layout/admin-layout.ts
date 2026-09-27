import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { GlassHeader } from "../../shared/ui/glass-header/glass-header";
import { UserAvatarMenuComponent } from "../../shared/ui/user-avatar-menu/user-avatar-menu";

@Component({
  imports: [RouterModule, GlassHeader, UserAvatarMenuComponent],
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: 'admin-layout.html',
})
export class AdminLayoutComponent {
  readonly router = inject(Router);

}
