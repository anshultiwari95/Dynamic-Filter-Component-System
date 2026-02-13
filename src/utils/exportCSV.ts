import { getNestedValue } from './filterEngine';

function escape(val: unknown): string {
  if (val === null || val === undefined) return '';
  const str = Array.isArray(val) ? val.join(', ') : String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCSV<T extends object>(
  data: readonly T[],
  columns: { accessor: string; label: string }[]
): string {
  const header = columns.map((c) => escape(c.label)).join(',');
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = getNestedValue(row, c.accessor);
        return escape(val);
      })
      .join(',')
  );
  return [header, ...rows].join('\n');
}

export function downloadCSV(
  csv: string,
  filename: string = `export-${new Date().toISOString().slice(0, 10)}.csv`
): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
