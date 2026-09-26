import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { RouterLink } from "@angular/router";
import { lucideChevronLeft } from "@ng-icons/lucide";

@Component({
  selector: 'app-admin-back-button',
  imports: [HlmButtonImports, CommonModule, NgIcon, RouterLink],
  providers:[
    provideIcons({
      lucideChevronLeft,
    }),
  ],
  standalone: true,
  templateUrl: './back-button.component.html'
})
export class BackButtonComponent {

}
