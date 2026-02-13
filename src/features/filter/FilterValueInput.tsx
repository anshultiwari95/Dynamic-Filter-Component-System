import { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import type { EmployeeFieldConfigItem, FilterValue, Operator } from '../../types';

const NO_VALUE_OPS: Operator[] = ['isEmpty', 'isNotEmpty'];

export interface FilterValueInputProps {
  fieldConfig: EmployeeFieldConfigItem;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  operator: Operator;
  debounceMs?: number;
  disabled?: boolean;
}

export function FilterValueInput({
  fieldConfig,
  value,
  onChange,
  operator,
  debounceMs = 0,
  disabled = false,
}: FilterValueInputProps) {
  const needsValue = !NO_VALUE_OPS.includes(operator);

  if (!needsValue) {
    return null;
  }

  const { type, options = [] } = fieldConfig;
  const useDebounce = type === 'text' && debounceMs > 0;

  const [localValue, setLocalValue] = useState<string>(
    () => (typeof value === 'string' ? value : '') ?? ''
  );

  const debouncedOnChange = useDebouncedCallback<[FilterValue]>(
    (v) => onChange(v),
    debounceMs
  );

  useEffect(() => {
    const str = typeof value === 'string' ? value : '';
    setLocalValue(str ?? '');
  }, [value]);

  const handleTextFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const v = e.target.value;
    if (type === 'number' || type === 'currency') {
      const num = v === '' ? '' : Number(v);
      onChange(num === '' ? null : (num as number));
    } else if (useDebounce) {
      setLocalValue(v);
      debouncedOnChange(v || null);
    } else {
      onChange(v || null);
    }
  };

  const handleSelectChange = (val: string | number | (string | number)[]) => {
    onChange(val as FilterValue);
  };

  const textDisplayValue = useDebounce ? localValue : (value ?? '');

  switch (type) {
    case 'text':
    case 'number':
      return (
        <TextField
          size="small"
          type={type === 'text' ? 'text' : 'number'}
          value={type === 'text' ? textDisplayValue : (value ?? '')}
          onChange={handleTextFieldChange}
          disabled={disabled}
          placeholder={type === 'number' ? '0' : 'Value...'}
          inputProps={type === 'number' ? { min: 0 } : undefined}
          sx={{ minWidth: 160 }}
        />
      );
    case 'currency':
      if (operator === 'between') {
        const range = value && typeof value === 'object' && 'min' in value && 'max' in value
          ? value as { min: number; max: number }
          : { min: 0, max: 0 };
        return (
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <TextField
              size="small"
              type="number"
              label="Min"
              value={range.min}
              onChange={(e) =>
                onChange({
                  ...range,
                  min: e.target.value === '' ? 0 : Number(e.target.value),
                })
              }
              disabled={disabled}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ minWidth: 120 }}
            />
            <TextField
              size="small"
              type="number"
              label="Max"
              value={range.max}
              onChange={(e) =>
                onChange({
                  ...range,
                  max: e.target.value === '' ? 0 : Number(e.target.value),
                })
              }
              disabled={disabled}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ minWidth: 120 }}
            />
          </Stack>
        );
      }
      return (
        <TextField
          size="small"
          type="number"
          value={value ?? ''}
          onChange={handleTextFieldChange}
          disabled={disabled}
          placeholder="0.00"
          inputProps={{ min: 0, step: 0.01 }}
          sx={{ minWidth: 160 }}
        />
      );

    case 'date':
      if (operator === 'between') {
        const range = value && typeof value === 'object' && 'start' in value && 'end' in value
          ? value as { start: string; end: string }
          : { start: '', end: '' };
        return (
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <TextField
              size="small"
              type="date"
              label="Start"
              value={range.start}
              onChange={(e) =>
                onChange({ ...range, start: e.target.value })
              }
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            <TextField
              size="small"
              type="date"
              label="End"
              value={range.end}
              onChange={(e) =>
                onChange({ ...range, end: e.target.value })
              }
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
          </Stack>
        );
      }
      return (
        <TextField
          size="small"
          type="date"
          value={
            typeof value === 'string' && value ? value : ''
          }
          onChange={handleTextFieldChange}
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
      );

    case 'boolean':
      return (
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Value</InputLabel>
          <Select
            value={
              value === true
                ? 'true'
                : value === false
                  ? 'false'
                  : ''
            }
            onChange={(e) => {
              const v = e.target.value;
              onChange(
                v === 'true'
                  ? true
                  : v === 'false'
                    ? false
                    : null
              );
            }}
            label="Value"
            disabled={disabled}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>
      );

    case 'singleSelect':
      return (
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Value</InputLabel>
          <Select
            value={(value ?? '') as string}
            onChange={(e) => handleSelectChange(e.target.value)}
            label="Value"
            disabled={disabled}
          >
            <MenuItem value="">Any</MenuItem>
            {options.map((opt) => (
              <MenuItem key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case 'multiSelect':
      return (
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Values</InputLabel>
          <Select
            multiple
            value={Array.isArray(value) ? value : []}
            onChange={(e) => {
              const v = e.target.value;
              onChange(
                (typeof v === 'string' ? v.split(',') : v) as string[]
              );
            }}
            label="Values"
            disabled={disabled}
            renderValue={(selected) =>
              (selected as string[]).map((s) => options.find((o) => o.value === s)?.label ?? s).join(', ')
            }
          >
            {options.map((opt) => (
              <MenuItem key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    default:
      return (
        <TextField
          size="small"
          type="text"
          value={String(value ?? '')}
          onChange={handleTextFieldChange}
          disabled={disabled}
          placeholder="Value..."
          sx={{ minWidth: 160 }}
        />
      );
  }
}
