import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmRadio, HlmRadioGroup } from '@spartan-ng/helm/radio-group';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { BrandLogo } from '../../../../shared/ui/brand-logo/brand-logo';
import { AssessmentStore } from '../../services/assessment-store';

@Component({
  selector: 'app-assessment-page',
  imports: [
    RouterLink,
    NgIcon,
    HlmAlertImports,
    HlmButton,
    HlmRadio,
    HlmRadioGroup,
    HlmSkeleton,
    HlmSpinner,
    BrandLogo,
  ],
  templateUrl: './assessment-page.html',
  viewProviders: [provideIcons({ lucideCheck, lucideCircleAlert })],
})
export class AssessmentPage implements OnInit {
  readonly store = inject(AssessmentStore);
  private readonly router = inject(Router);

  // The skeleton stands in for a step of four questions with five options
  readonly skeletonSteps = [0, 1, 2, 3];
  readonly skeletonOptions = [0, 1, 2, 3, 4];

  // One segment per question, lit up to the step the visitor is standing on
  readonly progressSegments = computed(() =>
    this.store.questions().map((question, index) => ({
      id: question.id,
      reached: index <= this.store.currentStepIndex(),
    })),
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

  saveAndExit(): void {
    this.router.navigate(['/mis-rutas']);
  }
}
