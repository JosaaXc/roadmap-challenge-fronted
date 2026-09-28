import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { HlmAvatarImports } from "@spartan-ng/helm/avatar";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmEmptyImports } from "@spartan-ng/helm/empty";
import { HlmSkeletonImports } from "@spartan-ng/helm/skeleton";
import { lucideChevronDown, lucideChevronUp, lucideNetwork } from "@ng-icons/lucide";
import { Component, computed, inject, OnInit } from "@angular/core";
import { HlmAlertImports } from "@spartan-ng/helm/alert";
import { PathCardComponent } from "../../../../shared/ui/path-card/path-card";
import { SearchComponent } from "../../../admin/components/search/search.component";
import { CommunityPathsStore } from "../../services/community-paths.store";
import { useListOrder } from "../../../../shared/utils/use-list-order";
import { toPathCard } from "../../../paths/utils/path-card";

@Component({
  selector: 'app-community-paths-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HlmButtonImports,
    HlmCardImports,
    HlmSkeletonImports,
    HlmEmptyImports,
    HlmAvatarImports,
    HlmAlertImports,
    NgIcon,
    PathCardComponent,
    SearchComponent
],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideChevronUp,
      lucideNetwork,
    }),
  ],
  templateUrl: './community-paths.html',
})
export class CommunityPathsPageComponent implements OnInit {
  readonly store = inject(CommunityPathsStore);
  readonly router = inject(Router);

  readonly listOrder = useListOrder(this.store.paths);

  // Mapped as on Mis rutas, so the shared card reads the same fields on every list
  readonly cards = computed(() => this.listOrder.orderedList().map(toPathCard));
  readonly order = this.listOrder.order;
  readonly toggleOrder = this.listOrder.toggleOrder;

  ngOnInit() {
    this.store.loadInitial();
  }

  onSearch(term: string | undefined): void{
    this.store.setSearch(term);
  }

}
