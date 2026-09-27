import { Component } from '@angular/core';
import { NotFoundState } from '../../ui/not-found-state/not-found-state';

@Component({
  imports: [NotFoundState],
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.html',
})
export class NotFoundPage {}
