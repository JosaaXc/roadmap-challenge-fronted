import { inject, Injectable, signal } from '@angular/core';
import { QuestionsApi } from './questions-api';
import { Question } from '../../models/questions-model';

@Injectable({ providedIn: 'root' })
export class QuestionsStore {
  private readonly api = inject(QuestionsApi);

  private readonly _questions = signal<Question[]>([]);
  private readonly _isLoading = signal<boolean>(true);

  readonly questions = this._questions.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  load(): void {
    this._isLoading.set(true);
    this.api.getQuestions().subscribe({
      next: (response) => {
        const sorted = response.data.sort((a, b) => a.order - b.order);
        this._questions.set(sorted);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando preguntas', err);
        this._isLoading.set(false);
      },
    });
  }

  deleteQuestion(id: string): void {
    this.api.deleteQuestion(id).subscribe({
      next: (response: any) => {
        // Manejo del 204 No Content
        if (!response || response.success) {
          this._questions.update((current) => current.filter((q) => q.id !== id));
        }
      },
      error: (err) => console.error('Error al eliminar', err),
    });
  }
}
