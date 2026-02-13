import { useCallback, useState } from 'react';
import type { Employee, FilterCondition } from '../types';

type NewFilterCondition = Omit<FilterCondition<Employee>, 'id'>;
type FilterUpdate = Partial<
  Pick<FilterCondition<Employee>, 'field' | 'operator' | 'value'>
>;

export interface UseFiltersReturn {
  filters: readonly FilterCondition<Employee>[];
  addFilter: (condition: NewFilterCondition) => void;
  removeFilter: (id: string) => void;
  updateFilter: (id: string, updates: FilterUpdate) => void;
  clearFilters: () => void;
}

function generateFilterId(): string {
  return crypto.randomUUID();
}

export function useFilters(initialFilters: FilterCondition<Employee>[] = []): UseFiltersReturn {
  const [filters, setFilters] = useState<ReadonlyArray<FilterCondition<Employee>>>(
    () => [...initialFilters]
  );

  const addFilter = useCallback((condition: NewFilterCondition) => {
    const newFilter: FilterCondition<Employee> = {
      ...condition,
      id: generateFilterId(),
    };
    setFilters((prev) => [...prev, newFilter]);
  }, []);

  const removeFilter = useCallback((id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateFilter = useCallback((id: string, updates: FilterUpdate) => {
    setFilters((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      )
    );
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  return {
    filters,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
  };
}
