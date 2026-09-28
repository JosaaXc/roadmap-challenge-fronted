import { Component, inject, input, OnInit, output, signal } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideGitFork, lucideLoader2 } from "@ng-icons/lucide";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { PathsApi } from "../../../features/paths/services/paths-api";

@Component({
  selector: 'app-fork-button',
  standalone: true,
  imports: [NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideGitFork, lucideLoader2 })],
  templateUrl: './fork-button.html',
})
export class ForkButtonComponent implements OnInit {
  private readonly api = inject(PathsApi);

  readonly pathId = input.required<string>();
  readonly initialCount = input<number>(0);

  readonly variant = input<'deafault' | 'community'>('deafault');

  // Emitimos el resultado para que el padre decida qué hacer (ej. redirigir a la nueva ruta)
  readonly forkSuccess = output<any>();

  readonly forksCount = signal<number>(0);
  readonly isProcessing = signal<boolean>(false);

  ngOnInit() {
    this.forksCount.set(this.initialCount());
  }

  fork(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isProcessing()) return;

    this.isProcessing.set(true);
    const idempotencyKey = crypto.randomUUID();

    this.api.forkPath(this.pathId(), idempotencyKey).subscribe({
      next: (response) => {
        this.forksCount.update((count) => count + 1);
        this.isProcessing.set(false);
        this.forkSuccess.emit(response.data);
      },
      error: (err) => {
        console.error('Error al clonar la ruta', err);
        this.isProcessing.set(false);
      },
    });
  }
}
