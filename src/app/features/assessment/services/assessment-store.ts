import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { retry, take, throwError, timer } from 'rxjs';
import {
  GENERATION_FINISH_MS,
  GENERATION_MIN_MS,
  GENERATION_STEP_MS,
  GENERATION_STEPS,
} from '../constants/assessment-constants';
import { PathDetailNavigationState } from '../../paths/models/paths-models';
import {
  GenerationStatus,
  Question,
  QuestionnaireDraft,
  UserAnswer,
} from '../models/assessment-models';
import { parseDraft, restoreDraft } from '../utils/questionnaire-draft';
import { AssessmentApi } from './assessment-api';

const DRAFT_KEY = 'cq:questionnaire-draft';

// A 409 means an earlier request with the same key is still running on the server
const IN_PROGRESS_RETRIES = 5;
const IN_PROGRESS_WAIT_MS = 1000;

@Service()
export class AssessmentStore {
  private readonly api = inject(AssessmentApi);
  private readonly router = inject(Router);

  private readonly _questions = signal<Question[]>([]);
  private readonly _currentStepIndex = signal<number>(0);
  private readonly _answers = signal<UserAnswer[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _isReviewing = signal<boolean>(false);
  // Set by Editar on the summary, so the edited question offers the way back to it
  private readonly _isEditingFromReview = signal<boolean>(false);
  private readonly _generation = signal<GenerationStatus>('idle');
  // How many generation steps are done; the one at this index is in progress
  private readonly _generationStep = signal<number>(0);

  // One per attempt: the first request for a set of answers creates it, Reintentar sends it
  // again, and changing an answer or getting the path drops it
  private idempotencyKey: string | null = null;

  readonly questions = this._questions.asReadonly();
  readonly currentStepIndex = this._currentStepIndex.asReadonly();
  readonly answers = this._answers.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isReviewing = this._isReviewing.asReadonly();
  readonly isEditingFromReview = this._isEditingFromReview.asReadonly();
  readonly generation = this._generation.asReadonly();
  readonly generationStep = this._generationStep.asReadonly();

  readonly currentQuestion = computed(() => {
    const qs = this._questions();
    return qs.length > 0 ? qs[this._currentStepIndex()] : null;
  });

  readonly totalSteps = computed(() => this.questions().length);
  readonly isLastStep = computed(() => this._currentStepIndex() === this.totalSteps() - 1);
  readonly progressPercentage = computed(() => {
    if(this.totalSteps() === 0) return 0;
    return ((this._currentStepIndex() + 1) / this.totalSteps()) * 100;
  });

  readonly canGoNext = computed(() => {
    const currentQ = this.currentQuestion();
    if(!currentQ) return false;
    //Si la pregunta no es obligatoria, puede avanzar
    if(!currentQ.isRequired) return true;
    //Si es obligatoria, debe tener una respuesta guardada
    return this._answers().some(a => a.questionId === currentQ.id);
  });

  // Every required question answered, whichever way the user got to the summary
  readonly canSubmit = computed(() =>
    this._questions().every(
      (question) =>
        !question.isRequired || this._answers().some((a) => a.questionId === question.id),
    ),
  );

  loadQuestions() {
    this._isLoading.set(true);
    this._error.set(null);
    // A failed attempt left behind is not shown again; one still running keeps its screen
    if (this._generation() !== 'running') this._generation.set('idle');

    this.api.getQuestions().subscribe({
      next: (res) =>{
        const sortedQuestions = res.data.sort((a,b) => a.order - b.order);
        this._questions.set(sortedQuestions);
        this.resumeDraft(sortedQuestions);
        this._isLoading.set(false);
      }, error: (err) => {
        this._error.set('No se pudo cargar el cuestionario.');
        this._isLoading.set(false);
      }
    });
  }

  selectOption(questionId: string, optionId: string){
    this._answers.update(answers => {
      const filtered = answers.filter(a => a.questionId !== questionId);
      return [...filtered, {questionId, optionId}];
    });
    this.idempotencyKey = null;
    this.saveDraft();
  }

  // Only optional questions offer it: a required one is changed, never emptied
  clearAnswer(questionId: string): void {
    this._answers.update((answers) => answers.filter((a) => a.questionId !== questionId));
    this.idempotencyKey = null;
    this.saveDraft();
  }

  nextStep() {
    if (this.canGoNext() && !this.isLastStep()){
      this._currentStepIndex.update(idx => idx + 1);
      this.saveDraft();
    }
  }

  previousStep(){
    if (this._currentStepIndex() > 0){
      this._currentStepIndex.update(idx => idx - 1);
      this.saveDraft();
    }
  }

  // The summary always sits after the last question, which is where Atrás returns to
  openReview(): void {
    if (!this.canGoNext()) return;

    this._currentStepIndex.set(this.totalSteps() - 1);
    this._isReviewing.set(true);
    this._isEditingFromReview.set(false);
    this.saveDraft();
  }

  closeReview(): void {
    this._isReviewing.set(false);
  }

  editQuestion(questionId: string): void {
    const index = this._questions().findIndex((question) => question.id === questionId);
    if (index === -1) return;

    this._currentStepIndex.set(index);
    this._isReviewing.set(false);
    this._isEditingFromReview.set(true);
    this.saveDraft();
  }

  // Called on every answer and step change, so leaving by any door keeps the progress
  saveDraft(): void {
    const draft: QuestionnaireDraft = {
      answers: this._answers(),
      currentQuestionId: this.currentQuestion()?.id ?? null,
      savedAt: new Date().toISOString(),
    };
    writeDraft(JSON.stringify(draft));
  }

  startGeneration(): void {
    if (!this.canSubmit() || this._generation() === 'running') return;
    this.runGeneration();
  }

  // Same attempt, same key: if the first request did reach the server, this one gets its path
  retryGeneration(): void {
    if (this._generation() === 'failed') this.runGeneration();
  }

  // Back to the summary from a failed attempt, with every answer as it was
  returnToReview(): void {
    this._generation.set('idle');
    this._isReviewing.set(true);
  }

  reset(){
    this._currentStepIndex.set(0);
    this._answers.set([]);
    this._error.set(null);
    this._isReviewing.set(false);
    this._isEditingFromReview.set(false);
    this._generation.set('idle');
    this._generationStep.set(0);
    this.idempotencyKey = null;
  }

  private runGeneration(): void {
    const key = (this.idempotencyKey ??= crypto.randomUUID());
    const startedAt = performance.now();

    this._generation.set('running');
    this._generationStep.set(0);

    // The steps advance on a clock: the API answers once, at the very end
    const clock = timer(GENERATION_STEP_MS, GENERATION_STEP_MS)
      .pipe(take(GENERATION_STEPS.length - 1))
      .subscribe(() => this._generationStep.update((step) => step + 1));

    // Either outcome waits out the minimum, so a quick answer never flashes past the steps
    const settle = (then: () => void) => {
      const remaining = GENERATION_MIN_MS - GENERATION_FINISH_MS - (performance.now() - startedAt);
      setTimeout(() => {
        clock.unsubscribe();
        then();
      }, Math.max(0, remaining));
    };

    this.api
      .generatePath(this._answers(), key)
      .pipe(
        retry({
          count: IN_PROGRESS_RETRIES,
          delay: (error: HttpErrorResponse) =>
            error.status === 409 ? timer(IN_PROGRESS_WAIT_MS) : throwError(() => error),
        }),
      )
      .subscribe({
        next: (response) => settle(() => this.finishGeneration(response.data.id)),
        error: (error: HttpErrorResponse) =>
          settle(() => this._generation.set(error.status === 422 ? 'no-courses' : 'failed')),
      });
  }

  private finishGeneration(pathId: string): void {
    this._generationStep.set(GENERATION_STEPS.length);
    writeDraft(null);

    // A beat on the finished list, then the path. Nobody is taken there if they already left
    setTimeout(() => {
      if (!this.router.url.startsWith('/cuestionario')) {
        this.reset();
        return;
      }

      const state: PathDetailNavigationState = { justGenerated: true };
      // Reset once the page has changed: doing it before would flash the first question
      this.router
        .navigate(['/mis-rutas', pathId], { state })
        .finally(() => this.reset());
    }, GENERATION_FINISH_MS);
  }

  // Picks up where the user left, minus any option the questionnaire no longer offers
  private resumeDraft(questions: Question[]): void {
    const draft = parseDraft(readDraft());
    if (!draft) return;

    const restored = restoreDraft(draft, questions);
    this._answers.set(restored.answers);
    this._currentStepIndex.set(restored.stepIndex);
    this._isReviewing.set(false);
    this._isEditingFromReview.set(false);
  }
}

// Storage can throw in private mode or with a full quota: the questionnaire keeps
// working from memory, it only loses the ability to survive a reload
function readDraft(): string | null {
  try {
    return localStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
}

function writeDraft(value: string | null): void {
  try {
    if (value === null) {
      localStorage.removeItem(DRAFT_KEY);
    } else {
      localStorage.setItem(DRAFT_KEY, value);
    }
  } catch {
    // Nothing to recover: the answers are still in memory
  }
}
