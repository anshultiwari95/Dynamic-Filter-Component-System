#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mock from 'mock-json-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const employeesPath = join(__dirname, '..', 'src', 'data', 'employees.json');
let employeesData = null;

function loadEmployees() {
  if (!employeesData) {
    employeesData = JSON.parse(readFileSync(employeesPath, 'utf-8'));
  }
  return employeesData;
}

const mockApi = mock({
  logging: true,
  mockRoutes: [
    {
      name: 'getEmployees',
      mockRoute: '/api/employees',
      method: 'GET',
      testScope: 'success',
      jsonTemplate: () => JSON.stringify(loadEmployees()),
    },
    {
      name: 'getEmployeeById',
      mockRoute: '/api/employees/:id',
      method: 'GET',
      testScope: 'success',
      jsonTemplate: (req) => {
        const { employees } = loadEmployees();
        const employee = employees.find((e) => e.id === req.params.id);
        if (!employee) {
          return JSON.stringify({ error: 'Employee not found' });
        }
        return JSON.stringify({ employee });
      },
    },
  ],
});

const PORT = process.env.MOCK_API_PORT || 3001;
const app = mockApi.createServer();

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
  console.log('  GET /api/employees     - List all employees');
  console.log('  GET /api/employees/:id - Get employee by ID');
  console.log('  POST /_reset           - Reset server state');
});
