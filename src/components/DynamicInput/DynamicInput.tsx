import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type {
  CurrencyRangeValue,
  DateRangeValue,
  DynamicInputProps,
} from './types';

function validateDateRange(value: DateRangeValue | null): string | undefined {
  if (!value?.start || !value?.end) return undefined;
  if (value.start > value.end) {
    return 'Start date must be before or equal to end date';
  }
  return undefined;
}

function validateCurrencyRange(
  value: CurrencyRangeValue | null
): string | undefined {
  if (value == null) return undefined;
  const { min, max } = value;
  if (typeof min !== 'number' || typeof max !== 'number') return undefined;
  if (min > max) {
    return 'Minimum must be less than or equal to maximum';
  }
  return undefined;
}

function DynamicInputText(props: Extract<DynamicInputProps, { type: 'text' }>) {
  const { value, onChange, disabled, placeholder, error } = props;
  return (
    <TextField
      size="small"
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
      placeholder={placeholder ?? 'Enter value...'}
      error={!!error}
      helperText={error}
      sx={{ minWidth: 180 }}
    />
  );
}

function DynamicInputNumber(
  props: Extract<DynamicInputProps, { type: 'number' }>
) {
  const { value, onChange, disabled, placeholder, error } = props;
  return (
    <TextField
      size="small"
      type="number"
      value={value ?? ''}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === '' ? null : Number(v));
      }}
      disabled={disabled}
      placeholder={placeholder ?? '0'}
      error={!!error}
      helperText={error}
      inputProps={{ min: 0 }}
      sx={{ minWidth: 160 }}
    />
  );
}

function DynamicInputDate(
  props: Extract<DynamicInputProps, { type: 'date' }>
) {
  const {
    value,
    onChange,
    disabled,
    error,
    startLabel = 'Start',
    endLabel = 'End',
  } = props;
  const range = value ?? { start: '', end: '' };
  const validationError = error ?? validateDateRange(value);

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <TextField
        size="small"
        type="date"
        label={startLabel}
        value={range.start}
        onChange={(e) =>
          onChange({ ...range, start: e.target.value })
        }
        disabled={disabled}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 160 }}
      />
      <TextField
        size="small"
        type="date"
        label={endLabel}
        value={range.end}
        onChange={(e) =>
          onChange({ ...range, end: e.target.value })
        }
        disabled={disabled}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 160 }}
      />
      {validationError && (
        <FormHelperText error sx={{ alignSelf: 'center' }}>
          {validationError}
        </FormHelperText>
      )}
    </Stack>
  );
}

function DynamicInputCurrency(
  props: Extract<DynamicInputProps, { type: 'currency' }>
) {
  const {
    value,
    onChange,
    disabled,
    error,
    minLabel = 'Min',
    maxLabel = 'Max',
  } = props;
  const range = value ?? { min: 0, max: 0 };
  const validationError = error ?? validateCurrencyRange(value);

  const handleMinChange = (v: number) => {
    const next = { ...range, min: v };
    onChange(next);
  };

  const handleMaxChange = (v: number) => {
    const next = { ...range, max: v };
    onChange(next);
  };

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <TextField
        size="small"
        type="number"
        label={minLabel}
        value={range.min}
        onChange={(e) =>
          handleMinChange(e.target.value === '' ? 0 : Number(e.target.value))
        }
        disabled={disabled}
        inputProps={{ min: 0, step: 0.01 }}
        sx={{ minWidth: 140 }}
      />
      <TextField
        size="small"
        type="number"
        label={maxLabel}
        value={range.max}
        onChange={(e) =>
          handleMaxChange(e.target.value === '' ? 0 : Number(e.target.value))
        }
        disabled={disabled}
        inputProps={{ min: 0, step: 0.01 }}
        sx={{ minWidth: 140 }}
      />
      {validationError && (
        <FormHelperText error sx={{ alignSelf: 'center' }}>
          {validationError}
        </FormHelperText>
      )}
    </Stack>
  );
}

function DynamicInputBoolean(
  props: Extract<DynamicInputProps, { type: 'boolean' }>
) {
  const { value, onChange, disabled, label } = props;
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Switch
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        color="primary"
      />
      {label && (
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      )}
    </Stack>
  );
}

function DynamicInputSingleSelect(
  props: Extract<DynamicInputProps, { type: 'singleSelect' }>
) {
  const { value, onChange, disabled, options, placeholder, error } = props;
  return (
    <FormControl size="small" sx={{ minWidth: 180 }} error={!!error}>
      <InputLabel>{placeholder ?? 'Select'}</InputLabel>
      <Select
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? null : (v as string | number));
        }}
        label={placeholder ?? 'Select'}
        disabled={disabled}
      >
        <MenuItem value="">Any</MenuItem>
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

function DynamicInputMultiSelect(
  props: Extract<DynamicInputProps, { type: 'multiSelect' }>
) {
  const { value, onChange, disabled, options, placeholder, error } = props;
  const selected = value ?? [];

  return (
    <FormControl size="small" sx={{ minWidth: 220 }} error={!!error}>
      <InputLabel>{placeholder ?? 'Select'}</InputLabel>
      <Select
        multiple
        value={selected}
        onChange={(e) => {
          const v = e.target.value;
          const arr = typeof v === 'string' ? v.split(',') : v;
          onChange(arr as (string | number)[]);
        }}
        label={placeholder ?? 'Select'}
        disabled={disabled}
        renderValue={(sel) =>
          (sel as (string | number)[])
            .map((s) => options.find((o) => String(o.value) === String(s))?.label ?? s)
            .join(', ')
        }
      >
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={String(opt.value)}>
            <Checkbox
              checked={selected.some((s) => String(s) === String(opt.value))}
            />
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

export function DynamicInput(props: DynamicInputProps) {
  switch (props.type) {
    case 'text':
      return <DynamicInputText {...props} />;
    case 'number':
      return <DynamicInputNumber {...props} />;
    case 'date':
      return <DynamicInputDate {...props} />;
    case 'currency':
      return <DynamicInputCurrency {...props} />;
    case 'boolean':
      return <DynamicInputBoolean {...props} />;
    case 'singleSelect':
      return <DynamicInputSingleSelect {...props} />;
    case 'multiSelect':
      return <DynamicInputMultiSelect {...props} />;
    default:
      return null;
  }
}
