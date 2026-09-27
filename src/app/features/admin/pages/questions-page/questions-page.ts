import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { QuestionsStore } from '../../services/questions/questions-store';
import { QuestionsApi } from '../../services/questions/questions-api';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Question, QuestionDto } from '../../models/questions-model';
import { finalize } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmBadge } from '@spartan-ng/helm/badge';
import {
  lucideAlertCircle,
  lucideArrowDownAZ,
  lucideArrowUpAZ,
  lucideEdit,
  lucideMoreHorizontal,
  lucidePlus,
  lucideSearch,
  lucideTrash2,
  lucideSave,
} from '@ng-icons/lucide';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-questions-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmTableImports,
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmAlertImports,
    HlmSelectImports,
    HlmSkeleton,
    HlmBadge,
    NgIcon,
    BackButtonComponent,
    ConfirmDialog
],
  providers: [
    provideIcons({
      lucideMoreHorizontal,
      lucideSearch,
      lucideArrowDownAZ,
      lucideArrowUpAZ,
      lucidePlus,
      lucideEdit,
      lucideTrash2,
      lucideAlertCircle,
      lucideSave,
    }),
  ],
  templateUrl: './questions-page.html',
})
export class QuestionsPage implements OnInit {
  readonly store = inject(QuestionsStore);
  private questionsApi = inject(QuestionsApi);
  private fb = inject(FormBuilder);

  @ViewChild('editDialogTrigger') editDialogTrigger!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeDialogBtn') closeDialogBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('deleteQuestionDialog') deleteQuestionDialog!: ConfirmDialog;
  @ViewChild('deleteOptionDialog') deleteOptionDialog!: ConfirmDialog;

  readonly errorMessage = signal<string | null>(null);
  readonly isSaving = signal<boolean>(false);
  readonly selectedQuestion = signal<Question | null>(null);
  readonly questionToDelete = signal<Question | null>(null);
    readonly optionToDelete = signal<{ index: number; questionId: string; optionId: string } | null>(null);
  readonly skeletonRows = [0, 1, 2, 3, 4];

  // NUEVO: Señal para saber qué opción específica se está guardando/eliminando
  readonly processingOptionIndex = signal<number | null>(null);

  readonly questionForm = this.fb.group({
    text: ['', Validators.required],
    order: [1, [Validators.required, Validators.min(1)]],
    isRequired: [true],
    isActive: [true],
    options: this.fb.array([]),
  });

  get optionsFormArray() {
    return this.questionForm.get('options') as FormArray;
  }

  ngOnInit() {
    this.store.load();
  }

  addOption() {
    const optionGroup = this.fb.group({
      id: [null],
      text: ['', Validators.required],
      tagsOutput: ['', Validators.required],
    });
    this.optionsFormArray.push(optionGroup);
  }

  // ==========================================
  // LÓGICA INDIVIDUAL DE OPCIONES
  // ==========================================

  saveSingleOption(index: number) {
    const currentQ = this.selectedQuestion();
    if (!currentQ) return;

    const optControl = this.optionsFormArray.at(index);
    if (optControl.invalid) return;

    this.processingOptionIndex.set(index);
    this.errorMessage.set(null);

    const optValue = optControl.value;
    const optionDto = {
      text: optValue.text,
      tagsOutput: optValue.tagsOutput
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t !== ''),
    };

    const request$ = optValue.id
      ? this.questionsApi.updateQuestionOption(currentQ.id, optValue.id, optionDto)
      : this.questionsApi.addQuestionOption(currentQ.id, optionDto);

    request$.pipe(finalize(() => this.processingOptionIndex.set(null))).subscribe({
      next: () => {
        alert('Opción guardada correctamente.');
        this.store.load(); // Recargamos para que impacte la BD
      },
      error: (err) =>
        this.errorMessage.set(this.formatBackendError(err, 'Error al guardar la opción.')),
    });
  }

  removeOption(index: number) {
    const currentQ = this.selectedQuestion();
    const optControl = this.optionsFormArray.at(index);
    const optId = optControl.value.id;

    // Si es modo edición y la opción ya existe en la Base de Datos
    if (currentQ && optId) {
      this.optionToDelete.set({ index, questionId: currentQ.id, optionId: optId });
      this.deleteOptionDialog.open();
    } else {
      // Si estamos creando, o añadimos una nueva fila pero nos arrepentimos
      this.optionsFormArray.removeAt(index);
    }
  }

  // ==========================================
  // MANEJO DEL MODAL Y PREGUNTA BASE
  // ==========================================

  openCreateDialog() {
    this.selectedQuestion.set(null);
    this.errorMessage.set(null);
    this.questionForm.reset({ order: 1, isRequired: true, isActive: true });
    this.optionsFormArray.clear();
    this.addOption();
    this.editDialogTrigger.nativeElement.click();
  }

  openEditDialog(question: Question) {
    this.selectedQuestion.set(question);
    this.errorMessage.set(null);

    this.questionForm.patchValue({
      text: question.text,
      order: question.order,
      isRequired: question.isRequired,
      isActive: question.isActive,
    });

    this.optionsFormArray.clear();
    question.options.forEach((opt) => {
      this.optionsFormArray.push(
        this.fb.group({
          id: [opt.id],
          text: [opt.text, Validators.required],
          tagsOutput: [''], // Vacío, obligando a rellenarlo
        }),
      );
    });

    this.editDialogTrigger.nativeElement.click();
  }

  deleteQuestion(question: Question) {
    this.questionToDelete.set(question);
    this.deleteQuestionDialog.open();
  }

  confirmDeleteQuestion() {
    const question = this.questionToDelete();
    if (question) {
      this.store.deleteQuestion(question.id);
      this.questionToDelete.set(null);
    }
  }

  confirmDeleteOption() {
    const option = this.optionToDelete();
    if (!option) return;

    this.processingOptionIndex.set(option.index);
    this.questionsApi
      .deleteQuestionOption(option.questionId, option.optionId)
      .pipe(finalize(() => this.processingOptionIndex.set(null)))
      .subscribe({
        next: () => {
          this.optionsFormArray.removeAt(option.index);
          this.optionToDelete.set(null);
          this.store.load();
        },
        error: (err) =>
          this.errorMessage.set(this.formatBackendError(err, 'Error al eliminar la opción.')),
      });
  }

  saveQuestion() {
    if (this.questionForm.invalid) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const formValue = this.questionForm.getRawValue();
    const current = this.selectedQuestion();

    if (current) {
      // MODO EDICIÓN: Solo actualizamos los campos base (PATCH)
      const updateBaseDto: Partial<QuestionDto> = {
        text: formValue.text ?? '',
        order: formValue.order ?? 1,
        isRequired: formValue.isRequired ?? true,
        isActive: formValue.isActive ?? true,
      };

      this.questionsApi
        .updateQuestion(current.id, updateBaseDto)
        .pipe(finalize(() => this.isSaving.set(false)))
        .subscribe({
          next: () => {
            this.closeDialogBtn.nativeElement.click();
            this.store.load();
          },
          error: (err) =>
            this.errorMessage.set(
              this.formatBackendError(err, 'Error al actualizar la pregunta.'),
            ),
        });
    } else {
      // MODO CREACIÓN: Enviamos la pregunta con todas sus opciones (POST)
      const createDto: QuestionDto = {
        text: formValue.text ?? '',
        order: formValue.order ?? 1,
        isRequired: formValue.isRequired ?? true,
        isActive: formValue.isActive ?? true,
        options: (formValue.options || []).map((opt: any) => ({
          text: opt.text,
          tagsOutput: opt.tagsOutput
            .split(',')
            .map((t: string) => t.trim())
            .filter((t: string) => t !== ''),
        })),
      };

      this.questionsApi
        .createQuestion(createDto)
        .pipe(finalize(() => this.isSaving.set(false)))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.closeDialogBtn.nativeElement.click();
              this.store.load();
            }
          },
          error: (err) =>
            this.errorMessage.set(this.formatBackendError(err, 'Error al guardar la pregunta.')),
        });
    }
  }

  private formatBackendError(error: any, fallback: string): string {
    const backendError = error?.error?.error;
    const message = backendError?.message || fallback;
    const details = Array.isArray(backendError?.details)
      ? backendError.details.filter((detail: unknown) => typeof detail === 'string')
      : [];

    return details.length > 0 ? `${message}: ${details.join('. ')}` : message;
  }
}
