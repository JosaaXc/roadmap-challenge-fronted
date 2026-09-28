import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAlertCircle, lucideArrowDownAZ, lucideArrowUpAZ, lucideChevronLeft, lucideEdit, lucideExternalLink, lucideMoreHorizontal, lucidePlus, lucideSearch, lucideTrash2 } from '@ng-icons/lucide';
import { CatalogApi } from '../../services/catalog/catalog-api';
import { Course, CourseDto } from '../../models/catalog-model';
import { finalize } from 'rxjs';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogStore } from '../../services/catalog/catalog-store';
import { SearchComponent } from '../../components/search/search.component';
import { SortToggleComponent } from '../../components/sort-toggle/sort-toggle.component';
import { LoadMoreComponent } from '../../components/load-more/load-more.component';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { ShortDatePipe } from '../../../paths/pipes/short-date.pipe';
import { CourseLevelPipe } from '../../pipes/course-level.pipe';
import { TagPicker } from '../../components/tag-picker/tag-picker';

@Component({
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
    SearchComponent,
    SortToggleComponent,
    LoadMoreComponent,
    ShortDatePipe,
    CourseLevelPipe,
    ConfirmDialog,
    BackButtonComponent,
    TagPicker
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
      lucideExternalLink,
      lucideAlertCircle,
    }),
  ],
  standalone: true,
  selector: 'app-catalog-page',
  templateUrl: './catalog-page.html',
})
export class CatalogPage implements OnInit {
  readonly store = inject(CatalogStore);

  readonly errorMessage = signal<string | null>(null);

  public readonly levels = [
    { label: 'Principiante', value: 'BEGINNER' },
    { label: 'Intermedio', value: 'INTERMEDIATE' },
    { label: 'Avanzado', value: 'ADVANCED' },
  ];

  public readonly levelToString = (value: string) =>
    this.levels.find((item) => item.value === value)?.label || 'Selecciona un nivel';

  private catalogApi = inject(CatalogApi);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  @ViewChild('editDialogTrigger') editDialogTrigger!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeDialogBtn') closeDialogBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('deleteCourseDialog') deleteCourseDialog!: ConfirmDialog;

  readonly isSaving = signal<boolean>(false);
  readonly selectedCourse = signal<Course | null>(null);
  readonly courseToDelete = signal<Course | null>(null);
  readonly pendingLevels = signal<string[]>([]);
  readonly skeletonRows = [0, 1, 2, 3, 4];

  readonly courseForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    description: ['', Validators.required],
    level: ['BEGINNER', Validators.required],
    tags: [[] as string[], Validators.required],
    url: ['', Validators.required],
    imageUrl: ['', Validators.required],
    isActive: [true],
  });

  constructor() {
    this.courseForm.controls.title.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newTitle) => {
        if (!this.selectedCourse()) {
          const generatedSlug = this.slugify(newTitle);
          this.courseForm.controls.slug.setValue(generatedSlug);
        }
      });
  }

  ngOnInit() {
    this.store.load();
  }

  toggleLevel(level: string): void {
    this.pendingLevels.update((levels) =>
      levels.includes(level) ? levels.filter((item) => item !== level) : [...levels, level],
    );
  }

  isLevelPending(level: string): boolean {
    return this.pendingLevels().includes(level);
  }

  applyLevelFilter(): void {
    this.store.setLevels(this.pendingLevels());
  }

  openCreateDialog() {
    this.selectedCourse.set(null); // Null indica que estamos creando
    this.errorMessage.set(null);
    this.courseForm.reset({
      level: 'BEGINNER',
      isActive: true,
      tags: [],
    });
    this.editDialogTrigger.nativeElement.click();
  }

  openEditDialog(course: Course) {
    this.selectedCourse.set(course); // Hay curso = estamos editando
    this.errorMessage.set(null);
    this.courseForm.patchValue({
      ...course,
      tags: course.tags ?? [],
    });

    this.editDialogTrigger.nativeElement.click();
  }

  deleteCourse(course: Course) {
    this.courseToDelete.set(course);
    this.deleteCourseDialog.open();
  }

  confirmDeleteCourse() {
    const course = this.courseToDelete();
    if (course) {
      this.store.deleteCourse(course.id);
      this.courseToDelete.set(null);
    }
  }

  saveCourse() {
    if (this.courseForm.invalid) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    // Preparamos los datos
    const courseDto: CourseDto = this.courseForm.getRawValue();

    const currentCourse = this.selectedCourse();

    const request$ = currentCourse
      ? this.catalogApi.updateCourse(currentCourse.id, courseDto)
      : this.catalogApi.createCourse(courseDto);

    request$.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: (response) => {
        if (response.success) {
          // Cerramos el modal
          this.closeDialogBtn.nativeElement.click();
          // Recargamos la lista para ver los cambios
          this.store.load();
        }
      },
      error: (err) => {
        console.error('Error al guardar curso', err);
        this.errorMessage.set(
          this.formatBackendError(
            err,
            'Ocurrió un error inesperado al guardar el curso. Intenta nuevamente.',
          ),
        );
      },
    });
  }

  private formatBackendError(error: any, fallback: string): string {
    const backendError = error?.error?.error;
    const message = backendError?.message || fallback;
    const details = Array.isArray(backendError?.details)
      ? backendError.details.filter((detail: unknown) => typeof detail === 'string')
      : [];

    return details.length > 0 ? `${message}: ${details.join('. ')}` : message;
  }

  private slugify(text: string): string {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}
