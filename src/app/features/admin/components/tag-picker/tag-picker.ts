import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideSearch } from '@ng-icons/lucide';
import {
  BrnComboboxAnchor,
  BrnComboboxPopoverTrigger,
  ComboboxFilter,
  comboboxContainsFilter,
} from '@spartan-ng/brain/combobox';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { TagsStore } from '../../services/tags/tags-store';
import { normalizeTag } from '../../utils/tags';

// Tags as badges plus a searchable list from the tag dictionary, for use with formControlName
// Picking instead of typing keeps a misspelled tag from reaching courses or answers
@Component({
  selector: 'app-tag-picker',
  imports: [
    NgIcon,
    BrnComboboxAnchor,
    BrnComboboxPopoverTrigger,
    HlmButtonImports,
    HlmComboboxImports,
    HlmInputGroupImports,
  ],
  providers: [
    provideIcons({ lucidePlus, lucideSearch }),
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TagPicker), multi: true },
  ],
  host: { class: 'block', '(focusout)': 'onFocusOut($event)' },
  templateUrl: './tag-picker.html',
})
export class TagPicker implements ControlValueAccessor, OnInit {
  // A course can bring a tag nobody uses yet; an answer option only picks existing ones
  readonly allowCreate = input(false, { transform: booleanAttribute });

  protected readonly store = inject(TagsStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly value = signal<string[]>([]);
  protected readonly search = signal('');
  protected readonly isDisabled = signal(false);

  // Picked tags the dictionary lacks, like one just created, stay listed so they can be unpicked
  protected readonly options = computed(() => {
    const known = this.store.tags();
    return [...this.value().filter((tag) => !known.includes(tag)), ...known];
  });

  protected readonly newTag = computed(() => {
    const tag = normalizeTag(this.search());
    return this.allowCreate() && tag !== '' && !this.options().includes(tag) ? tag : null;
  });

  // The create entry shows for any spelling of the search, like "Spring Boot"
  protected readonly filter: ComboboxFilter<string> = (tag, search, collator, itemToString) =>
    tag === this.newTag() || comboboxContainsFilter(tag, search, collator, itemToString);

  private onChange: (tags: string[]) => void = () => {};
  protected onTouched: () => void = () => {};

  ngOnInit(): void {
    this.store.load();
  }

  writeValue(tags: string[] | null): void {
    this.value.set(tags ?? []);
  }

  registerOnChange(fn: (tags: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected update(tags: string[] | null | undefined): void {
    const next = tags ?? [];
    this.value.set(next);
    this.onChange(next);
  }

  // Moving into the popover's search still counts as staying in the field
  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (!this.host.nativeElement.contains(next) && !next?.closest('hlm-combobox-content')) {
      this.onTouched();
    }
  }
}
