import { signal, computed, Signal } from '@angular/core';

export function useListOrder<T>(sourceSignal: Signal<T[]>) {
  const order = signal<'desc' | 'asc'>('desc');

  const orderedList = computed(() => {
    const list = sourceSignal();
    return order() === 'desc' ? list : [...list].reverse();
  });

  const toggleOrder = () => order.update((current) => (current === 'desc' ? 'asc' : 'desc'));

  return { order, orderedList, toggleOrder };
}
