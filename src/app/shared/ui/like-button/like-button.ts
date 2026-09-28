import { Component, inject, input, OnInit, output, signal } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideHeart } from "@ng-icons/lucide";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { PathsApi } from "../../../features/paths/services/paths-api";

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideHeart})],
  templateUrl: './like-button.html',
})
export class LikeButtonComponent implements OnInit {
  private readonly api = inject(PathsApi);

  readonly pathId = input.required<string>();
  readonly initialLiked = input<boolean>(false);
  readonly initialCount = input<number>(0);

  readonly likedChanged = output<{ liked: boolean; likesCount: number }>();

  readonly hasLiked = signal<boolean>(false);
  readonly likesCount = signal<number>(0);
  readonly isProcessing = signal<boolean>(false);

  ngOnInit() {
    this.hasLiked.set(this.initialLiked());
    this.likesCount.set(this.initialCount());
  }

  toggleLike(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isProcessing()) return;

    const previousLiked = this.hasLiked();
    const previousCount = this.likesCount();

    const nextLiked = !previousLiked;
    const nextCount = previousCount + (nextLiked ? 1 : -1);

    this.hasLiked.set(nextLiked);
    this.likesCount.set(Math.max(0, nextCount));
    this.isProcessing.set(true);

    const idempotencyKey = crypto.randomUUID();

    this.api.toggleLike(this.pathId(), idempotencyKey).subscribe({
      next: (response) => {
        this.hasLiked.set(response.data.liked);
        this.likesCount.set(response.data.likesCount);
        this.isProcessing.set(false);
        this.likedChanged.emit(response.data);
      },
      error: (err) => {
        console.error('Error al dar like', err);
        this.hasLiked.set(previousLiked);
        this.likesCount.set(previousCount);
        this.isProcessing.set(false);
      },
    });
  }
}
