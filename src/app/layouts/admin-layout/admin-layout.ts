import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrandLogo } from "../../shared/ui/brand-logo/brand-logo";
import { AuthStore } from "../../features/auth/services/auth-store";

@Component({
  imports: [RouterModule, BrandLogo],
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: 'admin-layout.html',
})
export class AdminLayoutComponent {
  authStore = inject(AuthStore);
}
