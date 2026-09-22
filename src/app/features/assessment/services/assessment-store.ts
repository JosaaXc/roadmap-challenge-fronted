import { computed, inject, Service, signal } from '@angular/core';
import { AssessmentApi } from './assessment-api';
import { Question, UserAnswer } from '../models/assessment-models';

@Service()
export class AssessmentStore {
  private readonly api = inject(AssessmentApi);

  private readonly _questions = signal<Question[]>([]);
  private readonly _currentStepIndex = signal<number>(0);
  private readonly _answers = signal<UserAnswer[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly questions = this._questions.asReadonly();
  readonly currentStepIndex = this._currentStepIndex.asReadonly();
  readonly answers = this._answers.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

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

  loadQuestions() {
    this._isLoading.set(true);
    this._error.set(null);

    this.api.getQuestions().subscribe({
      next: (res) =>{
        const sortedQuestions = res.data.sort((a,b) => a.order - b.order);
        this._questions.set(sortedQuestions);
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
  }

  nextStep() {
    if (this.canGoNext() && !this.isLastStep()){
      this._currentStepIndex.update(idx => idx + 1);
    }
  }

  previousStep(){
    if (this._currentStepIndex() > 0){
      this._currentStepIndex.update(idx => idx - 1);
    }
  }
}
