import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { Download } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { applyFilters, exportToCSV, getNestedValue, downloadCSV } from '../../utils';
import type { Employee } from '../../types';
import type { EmployeeFieldConfigItem } from '../../types';
import type { FilterCondition } from '../../types';

export type SortDirection = 'asc' | 'desc';

export interface TableColumnConfig {
  accessor: string;
  label: string;
  format?: (value: unknown) => string;
}

export interface DataTableProps {
  data: readonly Employee[];
  filters: readonly FilterCondition<Employee>[];
  fieldConfig: readonly EmployeeFieldConfigItem[];
}

function formatValue(value: unknown, type?: string): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number' && type === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return new Date(value).toLocaleDateString();
  }
  return String(value);
}

function defaultColumnsFromFieldConfig(
  config: readonly EmployeeFieldConfigItem[]
): TableColumnConfig[] {
  const displayOrder = [
    'id',
    'firstName',
    'lastName',
    'email',
    'department',
    'role',
    'salary',
    'joinDate',
    'lastReview',
    'isActive',
    'performanceRating',
    'projectsCount',
    'skills',
    'address.city',
    'address.state',
    'address.country',
  ];
  const byAccessor = new Map<string, EmployeeFieldConfigItem>(
    config.map((c) => [c.accessor, c])
  );
  return displayOrder
    .filter((a) => byAccessor.has(a))
    .map((a) => {
      const fc = byAccessor.get(a)!;
      return {
        accessor: fc.accessor,
        label: fc.label,
        format:
          fc.type === 'currency'
            ? (v) => formatValue(v, 'currency')
            : undefined,
      };
    });
}

export function DataTable({
  data,
  filters,
  fieldConfig,
}: DataTableProps) {
  const [orderBy, setOrderBy] = useState<string>('firstName');
  const [order, setOrder] = useState<SortDirection>('asc');
  const [isFiltering, setIsFiltering] = useState(false);

  const columns = useMemo(
    () => defaultColumnsFromFieldConfig(fieldConfig),
    [fieldConfig]
  );

  const filteredData = useMemo(
    () => applyFilters(data, filters),
    [data, filters]
  );

  useEffect(() => {
    if (filters.length === 0) return;
    setIsFiltering(true);
    const id = setTimeout(() => setIsFiltering(false), 150);
    return () => clearTimeout(id);
  }, [filters]);

  const handleExportCSV = useCallback(() => {
    const csv = exportToCSV(filteredData, columns);
    downloadCSV(csv, `employees-${new Date().toISOString().slice(0, 10)}.csv`);
  }, [filteredData, columns]);

  const sortedData = useMemo(() => {
    const arr = [...filteredData];
    arr.sort((a, b) => {
      const aVal = getNestedValue(a, orderBy);
      const bVal = getNestedValue(b, orderBy);
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      const isNumeric =
        !Number.isNaN(aNum) && !Number.isNaN(bNum) && typeof aVal !== 'string';
      let cmp = 0;
      if (isNumeric) {
        cmp = aNum - bNum;
      } else {
        cmp = aStr.localeCompare(bStr, undefined, { sensitivity: 'base' });
      }
      return order === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filteredData, orderBy, order]);

  const handleSort = (accessor: string) => {
    const isAsc = orderBy === accessor && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(accessor);
  };

  const totalCount = data.length;
  const filteredCount = filteredData.length;

  return (
    <Box role="region" aria-label="Employee data table" sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          background: 'linear-gradient(to right, rgba(255,255,255,0.95), rgba(248,250,252,0.9))',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            color="text.secondary"
            aria-live="polite"
            aria-atomic="true"
          >
            Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> records
          </Typography>
          {isFiltering && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} role="status" aria-label="Filtering data">
              <CircularProgress size={18} thickness={4} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Filtering...
              </Typography>
            </Box>
          )}
        </Box>
        <Button
          variant="contained"
          size="medium"
          startIcon={<Download size={18} />}
          onClick={handleExportCSV}
          disabled={filteredData.length === 0}
          aria-label="Export filtered data as CSV"
          sx={{ borderRadius: 2 }}
        >
          Export CSV
        </Button>
      </Paper>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: '100%',
          overflowX: 'auto',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
        aria-label="Employee records"
      >
        <Table size="small" stickyHeader role="grid" aria-rowcount={sortedData.length} aria-colcount={columns.length}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.accessor}
                  sortDirection={orderBy === col.accessor ? order : false}
                  scope="col"
                  role="columnheader"
                  aria-sort={orderBy === col.accessor ? (order === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  <TableSortLabel
                    active={orderBy === col.accessor}
                    direction={orderBy === col.accessor ? order : 'asc'}
                    onClick={() => handleSort(col.accessor)}
                    aria-label={`Sort by ${col.label}`}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }} role="cell">
                  <Typography color="text.secondary" id="empty-state-message" variant="body1" fontWeight={500}>
                    No results found. Try adjusting your filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, rowIdx) => (
                <TableRow
                  key={row.id}
                  hover
                  role="row"
                  aria-rowindex={rowIdx + 2}
                >
                  {columns.map((col) => {
                    const raw = getNestedValue(row, col.accessor);
                    const display = col.format
                      ? col.format(raw)
                      : formatValue(raw);
                    return (
                      <TableCell key={col.accessor} role="cell" sx={{ py: 1.25 }}>
                        {display}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
