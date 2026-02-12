import type { Employee } from '../types';

/**
 * Sample employee data for development and testing.
 * Demonstrates nested address structure.
 */
export const employees: Employee[] = [
  {
    id: 'emp-1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    department: 'Engineering',
    role: 'Software Engineer',
    salary: 95000,
    hireDate: '2022-03-15',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    },
  },
  {
    id: 'emp-2',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@example.com',
    department: 'Marketing',
    role: 'Marketing Manager',
    salary: 85000,
    hireDate: '2021-06-20',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
  },
  {
    id: 'emp-3',
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@example.com',
    department: 'Engineering',
    role: 'Senior Engineer',
    salary: 120000,
    hireDate: '2019-11-01',
    address: {
      street: '789 Pine Rd',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
    },
  },
  {
    id: 'emp-4',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    department: 'Sales',
    role: 'Sales Lead',
    salary: 78000,
    hireDate: '2023-01-10',
    address: {
      street: '321 Elm St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
    },
  },
  {
    id: 'emp-5',
    firstName: 'Eve',
    lastName: 'Brown',
    email: 'eve.brown@example.com',
    department: 'HR',
    role: 'HR Specialist',
    salary: 65000,
    hireDate: '2022-08-05',
    address: {
      street: '555 Maple Dr',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
  },
];
