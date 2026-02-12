/**
 * Core TypeScript types for the Dynamic Filter Component System.
 * Fully typed, scalable, with nested object support via dot-notation.
 */

// =============================================================================
// PRIMITIVE & PATH UTILITIES
// =============================================================================

/** Primitives that are leaf values in nested objects */
type Primitive = string | number | boolean | Date;

/** Recursively extracts dot-notation paths for nested objects (excludes arrays) */
type _NestedKeyOf<T, Prefix extends string = ''> = T extends Primitive
  ? never
  : T extends Array<unknown>
    ? never
    : (
        {
          [K in keyof T]: K extends string
            ? T[K] extends object
              ? T[K] extends Array<unknown>
                ? `${Prefix}${K}`
                : T[K] extends Date
                  ? `${Prefix}${K}`
                  : `${Prefix}${K}` | _NestedKeyOf<T[K], `${Prefix}${K}.`>
              : `${Prefix}${K}`
            : never;
        }
      )[keyof T];

export type NestedKeyOf<T> = _NestedKeyOf<T>;

/** Extracts the value type at a dot-notation path (e.g. "address.city" -> string) */
export type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? ValueAtPath<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

// =============================================================================
// EMPLOYEE DATA MODEL
// =============================================================================

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  hireDate: string; // ISO 8601 date string
  address: Address;
}

// =============================================================================
// FIELD TYPE & OPERATOR (String Literal Unions)
// =============================================================================

export type FieldType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'multiselect';

export type Operator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn';

// =============================================================================
// DEFAULT OPERATORS BY FIELD TYPE (for UX)
// =============================================================================

export const DEFAULT_OPERATORS_BY_TYPE: Record<FieldType, readonly Operator[]> =
  {
    string: [
      'equals',
      'notEquals',
      'contains',
      'startsWith',
      'endsWith',
      'isEmpty',
      'isNotEmpty',
    ],
    number: [
      'equals',
      'notEquals',
      'greaterThan',
      'lessThan',
      'greaterThanOrEqual',
      'lessThanOrEqual',
      'isEmpty',
      'isNotEmpty',
    ],
    date: [
      'equals',
      'notEquals',
      'greaterThan',
      'lessThan',
      'greaterThanOrEqual',
      'lessThanOrEqual',
      'isEmpty',
      'isNotEmpty',
    ],
    boolean: ['equals'],
    select: ['equals', 'notEquals', 'in', 'notIn', 'isEmpty', 'isNotEmpty'],
    multiselect: ['in', 'notIn', 'isEmpty', 'isNotEmpty'],
  } as const;

// =============================================================================
// FIELD CONFIG
// =============================================================================

export interface SelectOption<V = string | number> {
  value: V;
  label: string;
}

export interface FieldConfig<
  T extends object,
  K extends NestedKeyOf<T> = NestedKeyOf<T>,
> {
  /** Dot-notation path to the field (e.g. "address.city") */
  field: K;
  /** Human-readable label for the field */
  label: string;
  /** Data type of the field */
  type: FieldType;
  /** Operators available for this field (defaults by type if omitted) */
  operators?: readonly Operator[];
  /** Options for select/multiselect fields */
  options?: readonly SelectOption[];
  /** Placeholder for the value input */
  placeholder?: string;
}

// =============================================================================
// FILTER CONDITION
// =============================================================================

export interface FilterCondition<
  T extends object = object,
  K extends NestedKeyOf<T> = NestedKeyOf<T>,
> {
  id: string;
  field: K;
  operator: Operator;
  value: string | number | boolean | string[] | number[] | null;
}
