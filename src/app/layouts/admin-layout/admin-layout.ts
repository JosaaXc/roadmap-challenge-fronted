import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { BrandLogo } from "../../shared/ui/brand-logo/brand-logo";
import { UserAvatarMenuComponent } from "../../shared/ui/user-avatar-menu/user-avatar-menu";

@Component({
  imports: [RouterModule, BrandLogo, UserAvatarMenuComponent],
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: 'admin-layout.html',
})
export class AdminLayoutComponent {
  readonly router = inject(Router);

}
