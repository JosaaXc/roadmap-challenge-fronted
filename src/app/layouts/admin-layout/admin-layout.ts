import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { GlassHeader } from "../../shared/ui/glass-header/glass-header";
import { SiteFooter } from "../../shared/ui/site-footer/site-footer";
import { UserAvatarMenuComponent } from "../../shared/ui/user-avatar-menu/user-avatar-menu";

@Component({
  imports: [RouterModule, GlassHeader, SiteFooter, UserAvatarMenuComponent],
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: 'admin-layout.html',
})
export class AdminLayoutComponent {
  readonly router = inject(Router);

}
