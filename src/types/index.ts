type Primitive = string | number | boolean | Date;

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

export type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? ValueAtPath<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

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
  joinDate: string;
  lastReview: string;
  isActive: boolean;
  skills: string[];
  performanceRating: number;
  projectsCount: number;
  address: Address;
}

export type FieldType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'multiselect';

export type DisplayFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'currency'
  | 'boolean'
  | 'singleSelect'
  | 'multiSelect';

export type Operator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'doesNotContain'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn'
  | 'between';

export const DEFAULT_OPERATORS_BY_DISPLAY_TYPE: Record<
  DisplayFieldType,
  readonly Operator[]
> = {
  text: [
    'equals',
    'notEquals',
    'contains',
    'doesNotContain',
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
    'between',
    'isEmpty',
    'isNotEmpty',
  ],
  currency: [
    'equals',
    'notEquals',
    'greaterThan',
    'lessThan',
    'greaterThanOrEqual',
    'lessThanOrEqual',
    'between',
    'isEmpty',
    'isNotEmpty',
  ],
  boolean: ['equals'],
  singleSelect: [
    'equals',
    'notEquals',
    'in',
    'notIn',
    'isEmpty',
    'isNotEmpty',
  ],
  multiSelect: ['in', 'notIn', 'isEmpty', 'isNotEmpty'],
} as const;

export const DEFAULT_OPERATORS_BY_TYPE: Record<FieldType, readonly Operator[]> =
  {
    string: [
      'equals',
      'notEquals',
      'contains',
      'doesNotContain',
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
      'between',
      'isEmpty',
      'isNotEmpty',
    ],
    boolean: ['equals'],
    select: ['equals', 'notEquals', 'in', 'notIn', 'isEmpty', 'isNotEmpty'],
    multiselect: ['in', 'notIn', 'isEmpty', 'isNotEmpty'],
  } as const;

export interface SelectOption<V = string | number> {
  value: V;
  label: string;
}

export interface EmployeeFieldConfigItem<
  K extends NestedKeyOf<Employee> = NestedKeyOf<Employee>,
> {
  accessor: K;
  label: string;
  type: DisplayFieldType;
  allowedOperators: readonly Operator[];
  options?: readonly SelectOption[];
}

export interface FieldConfig<
  T extends object,
  K extends NestedKeyOf<T> = NestedKeyOf<T>,
> {
  field: K;
  label: string;
  type: FieldType;
  operators?: readonly Operator[];
  options?: readonly SelectOption[];
  placeholder?: string;
}

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | { start: string; end: string }
  | { min: number; max: number }
  | null;

export interface FilterCondition<
  T extends object = object,
  K extends NestedKeyOf<T> = NestedKeyOf<T>,
> {
  id: string;
  field: K;
  operator: Operator;
  value: FilterValue;
}
