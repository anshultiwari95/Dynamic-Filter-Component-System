import { useCallback } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Filter, Plus } from 'lucide-react';
import type { EmployeeFieldConfigItem } from '../../types';
import { employeeFieldConfig } from '../../data/employeeFieldConfig';
import { FilterRow } from './FilterRow';
import type { UseFiltersReturn } from '../../hooks/useFilters';

export interface FilterBuilderProps {
  filtersApi: UseFiltersReturn;
  fieldConfigs?: readonly EmployeeFieldConfigItem[];
}

export function FilterBuilder({
  filtersApi,
  fieldConfigs = employeeFieldConfig,
}: FilterBuilderProps) {
  const { filters, addFilter, removeFilter, updateFilter, clearFilters } =
    filtersApi;

  const handleAddFilter = useCallback(() => {
    const firstField = fieldConfigs[0];
    const firstOperator = firstField?.allowedOperators[0] ?? 'equals';
    addFilter({
      field: firstField?.accessor ?? 'firstName',
      operator: firstOperator,
      value: null,
    });
  }, [addFilter, fieldConfigs]);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(248,250,252,0.95))',
        border: '1px solid rgba(14, 165, 233, 0.2)',
        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.08)',
      }}
      role="region"
      aria-label="Filter builder"
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1.5}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Filter size={20} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="primary.dark" id="filters-heading">
              Filters
            </Typography>
          </Box>
          <Stack direction="row" gap={1.5}>
            <Button
              variant="contained"
              size="medium"
              startIcon={<Plus size={18} />}
              onClick={handleAddFilter}
              disabled={fieldConfigs.length === 0}
              aria-label="Add new filter"
              sx={{ px: 2, borderRadius: 2 }}
            >
              Add filter
            </Button>
            <Button
              variant="outlined"
              size="medium"
              color="secondary"
              onClick={clearFilters}
              disabled={filters.length === 0}
              aria-label="Clear all filters"
              sx={{ borderRadius: 2 }}
            >
              Clear all
            </Button>
          </Stack>
        </Stack>

        {filters.length === 0 ? (
          <Box
            sx={{
              py: 4,
              px: 2,
              textAlign: 'center',
              bgcolor: 'action.hover',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              role="status"
              aria-live="polite"
            >
              No filters applied. Click <strong>Add filter</strong> to get started.
            </Typography>
          </Box>
        ) : (
          <Stack
            spacing={1.5}
            role="list"
            aria-label={`${filters.length} active filter${filters.length === 1 ? '' : 's'}`}
          >
            {filters.map((filter) => (
              <Box
                key={filter.id}
                role="listitem"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
                }}
              >
                <FilterRow
                  filter={filter}
                  fieldConfigs={fieldConfigs}
                  updateFilter={updateFilter}
                  removeFilter={removeFilter}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
