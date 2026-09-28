import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { PublicPathsStore } from '../../services/public-paths/public-paths-store';
import { AdminPath } from '../../models/public-paths-model';

import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideTrash2, lucideArrowDownAZ, lucideArrowUpAZ, lucideChevronLeft } from '@ng-icons/lucide';

import { SortToggleComponent } from '../../components/sort-toggle/sort-toggle.component';
import { LoadMoreComponent } from '../../components/load-more/load-more.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { ShortDatePipe } from '../../../paths/pipes/short-date.pipe';

@Component({
  selector: 'app-public-paths-page',
  imports: [
    CommonModule,
    HlmTableImports,
    HlmButtonImports,
    NgIcon,
    SortToggleComponent,
    LoadMoreComponent,
    ShortDatePipe,
    HlmSkeleton,
    HlmBadge,
    ConfirmDialog,
    BackButtonComponent
],
  providers: [
    provideIcons({
      lucideEye,
      lucideTrash2,
      lucideArrowDownAZ,
      lucideArrowUpAZ,
      lucideChevronLeft,
    }),
  ],
  templateUrl: './public-paths-page.html',
})
export class PublicPaths implements OnInit {
  readonly store = inject(PublicPathsStore);
  private router = inject(Router);

  @ViewChild('deletePathDialog') deletePathDialog!: ConfirmDialog;

  readonly pathToDelete = signal<AdminPath | null>(null);
  readonly skeletonRows = [0, 1, 2, 3, 4];

  ngOnInit() {
    this.store.loadInitial();
  }

  viewPathDetail(path: AdminPath) {
    this.router.navigate(['/mis-rutas', path.id], {
      queryParams: { from: 'admin-public-paths' },
    });
  }

  deletePath(path: AdminPath) {
    this.pathToDelete.set(path);
    this.deletePathDialog.open();
  }

  confirmDeletePath() {
    const path = this.pathToDelete();
    if (path) {
      this.store.deletePath(path.id);
      this.pathToDelete.set(null);
    }
  }
}
