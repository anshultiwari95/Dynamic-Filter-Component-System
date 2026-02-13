import type { FilterCondition, FilterValue, Operator } from '../types';

export function getNestedValue<T extends object>(
  obj: T,
  path: string
): unknown {
  const keys = path.split('.');
  let current: unknown = obj;

  for (let i = 0; i < keys.length; i++) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[keys[i]!];
  }

  return current;
}

function parseDate(value: unknown): number {
  if (value === null || value === undefined) return Number.NaN;
  const str = String(value).trim();
  if (!str) return Number.NaN;
  const ts = Date.parse(str);
  return Number.isNaN(ts) ? Number.NaN : ts;
}

function normalizeForTextComparison(value: unknown): string {
  return String(value ?? '').toLowerCase().trim();
}

function normalizeToNumber(value: unknown): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

type SimpleCondition = {
  field: string;
  operator: Operator;
  value: FilterValue;
};

function matchesCondition<T extends object>(
  item: T,
  condition: SimpleCondition
): boolean {
  const fieldValue = getNestedValue(item, condition.field);
  const { operator, value } = condition;

  switch (operator) {
    case 'equals':
      if (typeof fieldValue === 'boolean' && typeof value === 'boolean') {
        return fieldValue === value;
      }
      if (Array.isArray(fieldValue)) {
        return false;
      }
      if (typeof value === 'string' && typeof fieldValue === 'string') {
        return normalizeForTextComparison(fieldValue) === normalizeForTextComparison(value);
      }
      if (typeof value === 'number' && (typeof fieldValue === 'number' || typeof fieldValue === 'string')) {
        return normalizeToNumber(fieldValue) === value;
      }
      return String(fieldValue ?? '') === String(value ?? '');

    case 'notEquals':
      return !matchesCondition(item, { ...condition, operator: 'equals' });

    case 'contains':
      return normalizeForTextComparison(fieldValue).includes(
        normalizeForTextComparison(value)
      );

    case 'doesNotContain':
      return !normalizeForTextComparison(fieldValue).includes(
        normalizeForTextComparison(value)
      );

    case 'startsWith':
      return normalizeForTextComparison(fieldValue).startsWith(
        normalizeForTextComparison(value)
      );

    case 'endsWith':
      return normalizeForTextComparison(fieldValue).endsWith(
        normalizeForTextComparison(value)
      );

    case 'isEmpty':
      if (Array.isArray(fieldValue)) return fieldValue.length === 0;
      const s = String(fieldValue ?? '').trim();
      return s === '';

    case 'isNotEmpty':
      return !matchesCondition(item, { ...condition, operator: 'isEmpty' });

    case 'greaterThan': {
      const f = typeof fieldValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(String(fieldValue))
        ? parseDate(fieldValue)
        : normalizeToNumber(fieldValue);
      const v = typeof value === 'object' && value !== null && 'start' in value
        ? 0
        : parseDate(value) || normalizeToNumber(value);
      return f > v;
    }

    case 'lessThan': {
      const f = typeof fieldValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(String(fieldValue))
        ? parseDate(fieldValue)
        : normalizeToNumber(fieldValue);
      const v = typeof value === 'object' && value !== null && 'start' in value
        ? 0
        : parseDate(value) || normalizeToNumber(value);
      return f < v;
    }

    case 'greaterThanOrEqual': {
      const f = typeof fieldValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(String(fieldValue))
        ? parseDate(fieldValue)
        : normalizeToNumber(fieldValue);
      const v = typeof value === 'object' && value !== null && 'start' in value
        ? 0
        : parseDate(value) || normalizeToNumber(value);
      return f >= v;
    }

    case 'lessThanOrEqual': {
      const f = typeof fieldValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(String(fieldValue))
        ? parseDate(fieldValue)
        : normalizeToNumber(fieldValue);
      const v = typeof value === 'object' && value !== null && 'start' in value
        ? 0
        : parseDate(value) || normalizeToNumber(value);
      return f <= v;
    }

    case 'between': {
      if (value && typeof value === 'object' && 'min' in value && 'max' in value) {
        const { min, max } = value as { min: number; max: number };
        const f = normalizeToNumber(fieldValue);
        return f >= min && f <= max;
      }
      const dateRange = value && typeof value === 'object' && 'start' in value && 'end' in value
        ? value as { start: string; end: string }
        : null;
      if (!dateRange?.start || !dateRange?.end) return false;
      const fieldTs = parseDate(fieldValue);
      const startTs = parseDate(dateRange.start);
      const endTs = parseDate(dateRange.end);
      if (Number.isNaN(fieldTs) || Number.isNaN(startTs) || Number.isNaN(endTs)) {
        return false;
      }
      return fieldTs >= startTs && fieldTs <= endTs;
    }

    case 'in': {
      const arr = Array.isArray(value) ? value : [];
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((fv) =>
          arr.some((a) => normalizeForTextComparison(fv) === normalizeForTextComparison(a))
        );
      }
      return arr.some(
        (a) => normalizeForTextComparison(fieldValue) === normalizeForTextComparison(a)
      );
    }

    case 'notIn': {
      return !matchesCondition(item, { ...condition, operator: 'in' });
    }

    default:
      return false;
  }
}

function groupConditionsByField(
  conditions: Array<{ field: string; operator: Operator; value: FilterValue }>
): Map<string, Array<{ field: string; operator: Operator; value: FilterValue }>> {
  const map = new Map<string, Array<{ field: string; operator: Operator; value: FilterValue }>>();
  for (const c of conditions) {
    const existing = map.get(c.field) ?? [];
    existing.push(c);
    map.set(c.field, existing);
  }
  return map;
}

interface ConditionLike {
  field: string;
  operator: Operator;
  value: FilterValue;
}

export function applyFilters<T extends object>(
  items: readonly T[],
  conditions: ReadonlyArray<FilterCondition<T> | ConditionLike>
): T[] {
  if (conditions.length === 0) return [...items];

  const byField = groupConditionsByField(
    conditions.map((c) => ({
      field: String(c.field),
      operator: c.operator,
      value: c.value,
    }))
  );

  const result: T[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    let passes = true;
    for (const [, fieldConditions] of byField) {
      const orMatch = fieldConditions.some((c) =>
        matchesCondition(item, c)
      );
      if (!orMatch) {
        passes = false;
        break;
      }
    }
    if (passes) result.push(item);
  }
  return result;
}
