import { Component, computed, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmRadio, HlmRadioGroup } from '@spartan-ng/helm/radio-group';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { GlassHeader } from '../../../../shared/ui/glass-header/glass-header';
import { GenerationScreen } from '../../components/generation-screen/generation-screen';
import { ReviewRow } from '../../models/assessment-models';
import { AssessmentStore } from '../../services/assessment-store';

@Component({
  selector: 'app-assessment-page',
  imports: [
    NgIcon,
    HlmAlertImports,
    HlmButton,
    HlmRadio,
    HlmRadioGroup,
    HlmSkeleton,
    GlassHeader,
    GenerationScreen,
  ],
  templateUrl: './assessment-page.html',
  viewProviders: [provideIcons({ lucideCheck, lucideCircleAlert })],
})
export class AssessmentPage implements OnInit {
  readonly store = inject(AssessmentStore);
  private readonly router = inject(Router);

  private readonly optionsGroup = viewChild<ElementRef<HTMLElement>>('optionsGroup');

  // The skeleton stands in for a step of four questions with five options
  readonly skeletonSteps = [0, 1, 2, 3];
  readonly skeletonOptions = [0, 1, 2, 3, 4];

  // One segment per question, lit up to the step the visitor is standing on
  readonly progressSegments = computed(() =>
    this.store.questions().map((question, index) => ({
      id: question.id,
      reached: this.store.isReviewing() || index <= this.store.currentStepIndex(),
    })),
  );

  readonly reviewRows = computed<ReviewRow[]>(() =>
    this.store.questions().map((question) => {
      const optionId = this.selectedOptionId(question.id);
      const option = question.options.find((candidate) => candidate.id === optionId);
      return { question, answer: option?.text ?? null };
    }),
  );

  ngOnInit() {
    this.store.loadQuestions();
  }

  // The radio group reads the whole answer, not a per-option boolean
  selectedOptionId(questionId: string): string | null {
    return (
      this.store.answers().find((answer) => answer.questionId === questionId)?.optionId ?? null
    );
  }

  // The group types its output after its value, so it can hand back the empty state too
  onOptionSelected(questionId: string, optionId: string | null): void {
    if (!optionId) return;
    this.store.selectOption(questionId, optionId);
  }

  // The button hides once there is nothing to clear, so focus goes back to the options
  clearAnswer(questionId: string): void {
    this.store.clearAnswer(questionId);
    this.optionsGroup()?.nativeElement.querySelector('input')?.focus();
  }

  // Every change is already saved; this one also records the step being left
  saveAndExit(): void {
    this.store.saveDraft();
    this.router.navigate(['/mis-rutas']);
  }
}
