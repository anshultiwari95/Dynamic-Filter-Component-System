# Dynamic Filter Component System

A reusable, type-safe dynamic filter system for React that integrates with data tables. Build powerful filter UIs with multiple conditions, field types, and operators—all with real-time table updates and persistence.

---

## What Is This?

This project is a **dynamic filter builder** that lets users:

- Add multiple filter conditions (e.g., "Department equals Engineering" and "Salary greater than 80000")
- Choose from different field types (text, number, date, currency, boolean, single/multi-select)
- Use operators that match each field type (contains, between, in, etc.)
- See results update in real time as filters change
- Persist filters in localStorage and the URL
- Export filtered data to CSV

The system is **generic** and **reusable**: you provide a field config and data; the filter engine applies conditions client-side and the table displays the results. It works with nested data (e.g., `address.city`) and supports AND/OR logic between filters.

---

## How It Works

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   FilterBuilder │────▶│ useFilters hook   │────▶│  DataTable  │
│   (UI: add,     │     │ (state + persist) │     │ (filtered   │
│    remove,      │     │                  │     │  + sorted)  │
│    clear)       │     └────────┬─────────┘     └────────────┘
└─────────────────┘              │
                                 ▼
                        ┌──────────────────┐
                        │  filterEngine    │
                        │  applyFilters()  │
                        │  (AND/OR logic)  │
                        └──────────────────┘
```

1. **FilterBuilder** – Renders filter rows. Each row has: field dropdown, operator dropdown, value input (type-specific), and a remove button.
2. **useFilters / useFiltersWithPersistence** – Holds filter state (array of conditions). Persistence saves to localStorage and URL params.
3. **filterEngine.applyFilters()** – Pure function. Takes data + conditions, returns filtered array. AND between different fields, OR within the same field.
4. **DataTable** – Displays filtered data. Sortable columns, nested object support, "Showing X of Y records", CSV export.

### Filter Logic

- **AND between fields**: `department = "Engineering"` **and** `salary > 80000` – both must match.
- **OR within same field**: Add two filters on Department ("Engineering" or "Marketing") – either matches.
- **Case-insensitive** text for contains, starts with, ends with.
- **Nested paths** like `address.city` work via dot notation.
- **Arrays** (e.g., skills) support `In` and `Not In`.

### Data Flow

1. User adds a filter → `addFilter()` appends a new condition.
2. User changes field/operator/value → `updateFilter()` updates that condition.
3. Filters change → `useMemo` runs `applyFilters(data, filters)`.
4. Table re-renders with `filteredData`.
5. On change, persistence saves filters to localStorage and URL.

---

## Features

- **Dynamic Filter Builder** – Add, remove, and clear filter conditions
- **Multi-type support** – Text, number, date, currency, single/multi-select, boolean
- **Smart operators** – Equals, Contains, Between, In, etc., by field type
- **Client-side filtering** – AND between fields, OR within same field
- **Sortable table** – Click column headers to sort
- **Persistence** – localStorage + URL query params
- **CSV export** – Export filtered results
- **Debounced text inputs** – Fewer re-renders while typing
- **Accessibility** – ARIA labels, roles, live regions

---

## Tech Stack

- React 19 (React 18 compatible)
- TypeScript
- Vite
- Material UI
- Lucide React
- mock-json-api (optional mock server)

---

## Setup

```bash
# Install dependencies
npm install

# Generate sample employee data (55 records)
npm run generate:employees

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Optional: Mock API

```bash
# In a separate terminal
npm run api
```

This starts a mock server on port 3001. The app will try to fetch employees from `http://localhost:3001/api/employees`. If the API is unavailable, it falls back to local JSON data.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run generate:employees` | Regenerate `src/data/employees.json` |
| `npm run api` | Start mock-json-api server on port 3001 |

---

## Project Structure

```
src/
├── components/       # Shared UI (DynamicInput)
├── features/
│   ├── filter/      # FilterBuilder, FilterRow, FilterValueInput
│   └── table/       # DataTable
├── hooks/            # useFilters, useFiltersWithPersistence, useEmployees
├── types/            # Employee, FilterCondition, Operator, etc.
├── utils/            # filterEngine, exportCSV, getNestedValue
└── data/             # employeeFieldConfig, employees.json
```

---

## Filter Operators by Type

| Type | Operators |
|------|-----------|
| Text | Equals, Not equals, Contains, Does not contain, Starts with, Ends with |
| Number | Equals, Not equals, Greater than, Less than, Greater or equal, Less or equal |
| Date | Equals, Not equals, Between, Greater/Less than |
| Currency | Same as number + Between (min/max) |
| Single select | Equals, Not equals, In, Not in |
| Multi-select | In, Not in |
| Boolean | Equals |

---

## Usage Example

### FilterBuilder with useFilters

```tsx
import { FilterBuilder } from './features/filter';
import { useFiltersWithPersistence } from './hooks';

function MyPage() {
  const filtersApi = useFiltersWithPersistence();
  return <FilterBuilder filtersApi={filtersApi} />;
}
```

### DataTable

```tsx
import { DataTable } from './features/table';

<DataTable
  data={employees}
  filters={filters}
  fieldConfig={employeeFieldConfig}
/>
```

---

## Deployment

```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host. For the mock API in production, set `VITE_API_URL` to your API endpoint.

---

## License

MIT
