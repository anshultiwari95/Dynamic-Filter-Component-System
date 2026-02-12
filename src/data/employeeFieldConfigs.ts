import type { FieldConfig } from '../types';
import type { Employee } from '../types';
import { DEFAULT_OPERATORS_BY_TYPE } from '../types';

/**
 * Field configurations for filtering Employee data.
 * Demonstrates nested dot-notation support (e.g. address.city).
 */
export const employeeFieldConfigs: FieldConfig<Employee>[] = [
  {
    field: 'firstName',
    label: 'First Name',
    type: 'string',
    placeholder: 'Enter first name',
  },
  {
    field: 'lastName',
    label: 'Last Name',
    type: 'string',
    placeholder: 'Enter last name',
  },
  {
    field: 'email',
    label: 'Email',
    type: 'string',
    placeholder: 'Enter email',
  },
  {
    field: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'Sales', label: 'Sales' },
      { value: 'HR', label: 'HR' },
      { value: 'Finance', label: 'Finance' },
    ],
  },
  {
    field: 'role',
    label: 'Role',
    type: 'string',
    placeholder: 'Enter role',
  },
  {
    field: 'salary',
    label: 'Salary',
    type: 'number',
    operators: DEFAULT_OPERATORS_BY_TYPE.number,
    placeholder: 'Enter amount',
  },
  {
    field: 'hireDate',
    label: 'Hire Date',
    type: 'date',
    placeholder: 'Select date',
  },
  {
    field: 'address.city',
    label: 'City',
    type: 'string',
    placeholder: 'Enter city',
  },
  {
    field: 'address.state',
    label: 'State',
    type: 'string',
    placeholder: 'Enter state',
  },
  {
    field: 'address.country',
    label: 'Country',
    type: 'string',
    placeholder: 'Enter country',
  },
];
