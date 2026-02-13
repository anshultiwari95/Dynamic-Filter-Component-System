import { useEffect, useRef } from 'react';
import { useFilters } from './useFilters';
import type { FilterCondition } from '../types';
import type { Employee } from '../types';
import type { UseFiltersReturn } from './useFilters';

const STORAGE_KEY = 'employee-filters';
const URL_PARAM = 'filters';

function parseFilters(storage: string | null): FilterCondition<Employee>[] {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((f): f is FilterCondition<Employee> => {
      if (!f || typeof f !== 'object') return false;
      const o = f as Record<string, unknown>;
      return typeof o.id === 'string' && typeof o.field === 'string' && typeof o.operator === 'string';
    });
  } catch {
    return [];
  }
}

function parseFiltersFromUrl(): FilterCondition<Employee>[] {
  if (typeof window === 'undefined') return [];
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get(URL_PARAM);
  if (!encoded) return [];
  try {
    const json = decodeURIComponent(encoded);
    return parseFilters(json);
  } catch {
    return [];
  }
}

function getInitialFilters(): FilterCondition<Employee>[] {
  const fromUrl = parseFiltersFromUrl();
  if (fromUrl.length > 0) return fromUrl;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return parseFilters(stored);
  } catch {
    return [];
  }
}

function saveToStorage(filters: readonly FilterCondition<Employee>[]) {
  try {
    if (filters.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }
  } catch {}
}

function saveToUrl(filters: readonly FilterCondition<Employee>[]) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (filters.length === 0) {
    url.searchParams.delete(URL_PARAM);
  } else {
    url.searchParams.set(URL_PARAM, encodeURIComponent(JSON.stringify(filters)));
  }
  window.history.replaceState({}, '', url.toString());
}

export function useFiltersWithPersistence(): UseFiltersReturn {
  const filtersApi = useFilters(getInitialFilters());
  const { filters } = filtersApi;
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      saveToStorage(filters);
      saveToUrl(filters);
      return;
    }
    saveToStorage(filters);
    saveToUrl(filters);
  }, [filters]);

  return filtersApi;
}
