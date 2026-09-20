import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthAside } from './auth-aside/auth-aside';

@Component({
  imports: [RouterOutlet, AuthAside],
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
