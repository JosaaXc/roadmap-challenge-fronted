import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToaster } from '@spartan-ng/helm/sonner';

@Component({
  imports: [RouterOutlet, HlmToaster],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
