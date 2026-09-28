import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from '../../shared/ui/site-footer/site-footer';
import { AuthAside } from './auth-aside/auth-aside';

@Component({
  imports: [RouterOutlet, AuthAside, SiteFooter],
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
