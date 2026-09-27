import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { HlmAvatarImports } from "@spartan-ng/helm/avatar";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmEmptyImports } from "@spartan-ng/helm/empty";
import { HlmSkeletonImports } from "@spartan-ng/helm/skeleton";
import { lucideChevronDown, lucideChevronUp, lucideNetwork } from "@ng-icons/lucide";
import { Component, inject, OnInit } from "@angular/core";
import { CommunityPathsStore } from "../services/community-paths.store";
import { PathCardComponent } from "../../../shared/ui/path-card/path-card";
import { useListOrder } from "../../../shared/utils/use-list-order";
import { HlmAlertImports } from "@spartan-ng/helm/alert";
import { SearchComponent } from "../../admin/components/search/search.component";

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

  readonly cards = this.listOrder.orderedList;
  readonly order = this.listOrder.order;
  readonly toggleOrder = this.listOrder.toggleOrder;

  ngOnInit() {
    this.store.loadInitial();
  }

  onSearch(term: string | undefined): void{
    this.store.setSearch(term);
  }

}
