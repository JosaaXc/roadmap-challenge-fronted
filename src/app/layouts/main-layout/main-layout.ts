import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BrandLogo } from '../../shared/ui/brand-logo/brand-logo';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BrandLogo],
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
})
export class MainLayout {}
