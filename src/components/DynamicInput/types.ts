export interface DateRangeValue {
  start: string;
  end: string;
}

export interface CurrencyRangeValue {
  min: number;
  max: number;
}

export type DynamicInputValue =
  | string
  | number
  | boolean
  | (string | number)[]
  | DateRangeValue
  | CurrencyRangeValue
  | null;

export interface DynamicInputBaseProps {
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  error?: string;
}

export interface DynamicInputTextProps extends DynamicInputBaseProps {
  type: 'text';
  value: string | null;
  onChange: (value: string | null) => void;
}

export interface DynamicInputNumberProps extends DynamicInputBaseProps {
  type: 'number';
  value: number | null;
  onChange: (value: number | null) => void;
}

export interface DynamicInputDateProps extends DynamicInputBaseProps {
  type: 'date';
  value: DateRangeValue | null;
  onChange: (value: DateRangeValue | null) => void;
  startLabel?: string;
  endLabel?: string;
}

export interface DynamicInputCurrencyProps extends DynamicInputBaseProps {
  type: 'currency';
  value: CurrencyRangeValue | null;
  onChange: (value: CurrencyRangeValue | null) => void;
  minLabel?: string;
  maxLabel?: string;
}

export interface DynamicInputBooleanProps extends DynamicInputBaseProps {
  type: 'boolean';
  value: boolean;
  onChange: (value: boolean) => void;
}

export interface DynamicInputSingleSelectProps extends DynamicInputBaseProps {
  type: 'singleSelect';
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options: readonly { value: string | number; label: string }[];
}

export interface DynamicInputMultiSelectProps extends DynamicInputBaseProps {
  type: 'multiSelect';
  value: (string | number)[] | null;
  onChange: (value: (string | number)[] | null) => void;
  options: readonly { value: string | number; label: string }[];
}

export type DynamicInputProps =
  | DynamicInputTextProps
  | DynamicInputNumberProps
  | DynamicInputDateProps
  | DynamicInputCurrencyProps
  | DynamicInputBooleanProps
  | DynamicInputSingleSelectProps
  | DynamicInputMultiSelectProps;
