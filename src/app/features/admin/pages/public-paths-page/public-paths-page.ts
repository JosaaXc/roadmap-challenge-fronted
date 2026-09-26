import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router'; // Para la redirección
import { PublicPathsStore } from '../../services/public-paths/public-paths-store';
import { AdminPath } from '../../models/public-paths-model';

import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideTrash, lucideArrowDownAZ, lucideArrowUpAZ } from '@ng-icons/lucide';

import { SortToggleComponent } from '../../components/sort-toggle/sort-toggle.component';
import { LoadMoreComponent } from '../../components/load-more/load-more.component';

@Component({
  selector: 'app-public-paths-page',
  imports: [
    CommonModule,
    HlmTableImports,
    HlmButtonImports,
    NgIcon,
    SortToggleComponent,
    LoadMoreComponent,
    DatePipe,
  ],
  providers: [
    provideIcons({
      lucideEye,
      lucideTrash,
      lucideArrowDownAZ,
      lucideArrowUpAZ,
    }),
  ],
  templateUrl: './public-paths-page.html',
})
export class PublicPaths implements OnInit {
  readonly store = inject(PublicPathsStore);
  private router = inject(Router);

  ngOnInit() {
    this.store.loadInitial();
  }

  viewPathDetail(path: AdminPath) {
    // Redirige a la vista de detalles. Falta ajustar a la ruta
    this.router.navigate(['/mis-rutas/', path.id]);
  }

  deletePath(path: AdminPath) {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar permanentemente la ruta:\n"${path.title}" de ${path.owner.username}?`,
      )
    ) {
      this.store.deletePath(path.id);
    }
  }
}
