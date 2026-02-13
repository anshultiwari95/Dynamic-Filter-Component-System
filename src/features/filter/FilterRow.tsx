import { memo, useCallback } from 'react';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import type {
  Employee,
  EmployeeFieldConfigItem,
  FilterCondition,
  FilterValue,
  NestedKeyOf,
  Operator,
} from '../../types';
import { FilterValueInput } from './FilterValueInput';

const OP_LABELS: Record<Operator, string> = {
  equals: 'Equals',
  notEquals: 'Not equals',
  contains: 'Contains',
  doesNotContain: 'Does not contain',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  isEmpty: 'Is empty',
  isNotEmpty: 'Is not empty',
  greaterThan: 'Greater than',
  lessThan: 'Less than',
  greaterThanOrEqual: 'Greater or equal',
  lessThanOrEqual: 'Less or equal',
  in: 'In',
  notIn: 'Not in',
  between: 'Between',
};

export interface FilterRowProps {
  filter: FilterCondition<Employee>;
  fieldConfigs: readonly EmployeeFieldConfigItem[];
  updateFilter: (id: string, updates: { field?: NestedKeyOf<Employee>; operator?: Operator; value?: FilterValue }) => void;
  removeFilter: (id: string) => void;
}

function FilterRowComponent({
  filter,
  fieldConfigs,
  updateFilter,
  removeFilter,
}: FilterRowProps) {
  const fieldConfig = fieldConfigs.find((fc) => fc.accessor === filter.field);
  const operators = fieldConfig?.allowedOperators ?? [];

  const onUpdate = useCallback(
    (updates: { field?: NestedKeyOf<Employee>; operator?: Operator; value?: FilterValue }) => {
      updateFilter(filter.id, updates);
    },
    [filter.id, updateFilter]
  );

  const onRemove = useCallback(() => {
    removeFilter(filter.id);
  }, [filter.id, removeFilter]);

  const handleFieldChange = useCallback(
    (e: { target: { value: string } }) => {
      const newField = e.target.value as NestedKeyOf<Employee>;
      const newFieldConfig = fieldConfigs.find((fc) => fc.accessor === newField);
      const newOperator = newFieldConfig?.allowedOperators[0] ?? 'equals';
      onUpdate({
        field: newField,
        operator: newOperator,
        value: null,
      });
    },
    [fieldConfigs, onUpdate]
  );

  const handleOperatorChange = useCallback(
    (e: { target: { value: string } }) => {
      onUpdate({ operator: e.target.value as Operator });
    },
    [onUpdate]
  );

  const handleValueChange = useCallback(
    (value: FilterValue) => {
      onUpdate({ value });
    },
    [onUpdate]
  );

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      gap={1}
      flexWrap="wrap"
      role="group"
      aria-label="Filter condition"
    >
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id={`filter-field-${filter.id}`}>Field</InputLabel>
        <Select
          value={filter.field}
          onChange={handleFieldChange}
          label="Field"
          labelId={`filter-field-${filter.id}`}
          aria-label="Filter by field"
        >
          {fieldConfigs.map((fc) => (
            <MenuItem key={fc.accessor} value={fc.accessor}>
              {fc.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id={`filter-operator-${filter.id}`}>Operator</InputLabel>
        <Select
          value={filter.operator}
          onChange={handleOperatorChange}
          label="Operator"
          labelId={`filter-operator-${filter.id}`}
          aria-label="Filter operator"
        >
          {operators.map((op) => (
            <MenuItem key={op} value={op}>
              {OP_LABELS[op]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {fieldConfig && (
        <FilterValueInput
          fieldConfig={fieldConfig}
          value={filter.value}
          onChange={handleValueChange}
          operator={filter.operator}
          debounceMs={fieldConfig.type === 'text' ? 300 : 0}
        />
      )}

      <IconButton
        size="small"
        onClick={onRemove}
        color="error"
        aria-label={`Remove filter for ${fieldConfig?.label ?? filter.field}`}
        sx={{ mt: 0.5 }}
      >
        <Trash2 size={18} />
      </IconButton>
    </Stack>
  );
}

export const FilterRow = memo(FilterRowComponent);
