import {
  Box,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { FilterBuilder } from './features/filter';
import { DataTable } from './features/table';
import { employeeFieldConfig } from './data/employeeFieldConfig';
import { employees } from './data';
import { useEmployees, useFiltersWithPersistence } from './hooks';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
    secondary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const filtersApi = useFiltersWithPersistence();
  const { filters } = filtersApi;
  const { data: employeesFromApi, loading, error } = useEmployees(employees);
  const dataSource = employeesFromApi.length > 0 ? employeesFromApi : employees;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" className="app-container">
        <Box className="app-header">
          <h1 className="app-title">Dynamic Filter Component System</h1>
          <p className="app-subtitle">
            Build, apply, and persist filters across text, numbers, dates, and more
          </p>
        </Box>

        <Box className="filter-section">
          <FilterBuilder filtersApi={filtersApi} />
        </Box>

        <Box className="data-section">
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                py: 8,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <CircularProgress size={28} thickness={4} />
              <Typography color="text.secondary" fontWeight={500}>
                Loading employees from API...
              </Typography>
            </Box>
          ) : (
            <>
              {error && (
                <Box sx={{ mb: 2 }}>
                  <span className="api-fallback-badge">
                    Using local data (API unavailable). Run <code>npm run api</code> to use mock API.
                  </span>
                </Box>
              )}
              <DataTable
                data={dataSource}
                filters={filters}
                fieldConfig={employeeFieldConfig}
              />
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
