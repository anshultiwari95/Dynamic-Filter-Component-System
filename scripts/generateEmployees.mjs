#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FIRST_NAMES = [
  'James', 'Emma', 'Oliver', 'Sophia', 'William', 'Isabella', 'Liam', 'Mia',
  'Noah', 'Charlotte', 'Benjamin', 'Amelia', 'Elijah', 'Harper', 'Lucas',
  'Evelyn', 'Mason', 'Abigail', 'Ethan', 'Emily', 'Alexander', 'Elizabeth',
  'Henry', 'Sofia', 'Sebastian', 'Avery', 'Jack', 'Ella', 'Aiden', 'Scarlett',
  'Owen', 'Grace', 'Samuel', 'Chloe', 'Matthew', 'Victoria', 'Joseph', 'Riley',
  'Levi', 'Aria', 'Mateo', 'Lily', 'David', 'Aurora', 'John', 'Zoey',
  'Wyatt', 'Penelope', 'Gabriel', 'Layla'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts'
];

const DEPARTMENTS = [
  { name: 'Engineering', roles: ['Software Engineer', 'Senior Engineer', 'Staff Engineer', 'Tech Lead', 'DevOps Engineer', 'QA Engineer'] },
  { name: 'Marketing', roles: ['Marketing Manager', 'Content Strategist', 'Brand Specialist', 'SEO Analyst', 'Growth Lead'] },
  { name: 'Sales', roles: ['Sales Representative', 'Sales Lead', 'Account Executive', 'Sales Manager', 'SDR'] },
  { name: 'HR', roles: ['HR Specialist', 'Recruiter', 'HR Business Partner', 'Talent Manager', 'People Ops'] },
  { name: 'Finance', roles: ['Financial Analyst', 'Accountant', 'Finance Manager', 'Controller', 'FP&A Analyst'] },
  { name: 'Product', roles: ['Product Manager', 'Product Owner', 'Associate PM', 'Head of Product'] },
  { name: 'Design', roles: ['Product Designer', 'UX Designer', 'UI Designer', 'Design Lead'] },
  { name: 'Operations', roles: ['Operations Manager', 'Operations Analyst', 'Supply Chain Specialist'] },
];

const SKILLS = [
  'React', 'Node.js', 'TypeScript', 'GraphQL', 'Python', 'Java', 'AWS',
  'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Redis', 'PostgreSQL',
  'Angular', 'Vue.js', 'Rust', 'Go', 'CI/CD', 'Terraform', 'TensorFlow'
];

const CITIES = [
  { city: 'San Francisco', state: 'CA', country: 'USA' },
  { city: 'New York', state: 'NY', country: 'USA' },
  { city: 'Seattle', state: 'WA', country: 'USA' },
  { city: 'Austin', state: 'TX', country: 'USA' },
  { city: 'Boston', state: 'MA', country: 'USA' },
  { city: 'Los Angeles', state: 'CA', country: 'USA' },
  { city: 'Chicago', state: 'IL', country: 'USA' },
  { city: 'Denver', state: 'CO', country: 'USA' },
  { city: 'Portland', state: 'OR', country: 'USA' },
  { city: 'San Diego', state: 'CA', country: 'USA' },
  { city: 'Philadelphia', state: 'PA', country: 'USA' },
  { city: 'Phoenix', state: 'AZ', country: 'USA' },
  { city: 'Miami', state: 'FL', country: 'USA' },
  { city: 'London', state: 'Greater London', country: 'UK' },
  { city: 'Toronto', state: 'Ontario', country: 'Canada' },
  { city: 'Berlin', state: 'Berlin', country: 'Germany' },
];

const STREET_PREFIXES = ['Main St', 'Oak Ave', 'Maple Dr', 'Pine Rd', 'Elm St', 'Cedar Ln', 'Park Ave', 'Lake View Dr', 'Hill Rd'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function pickMany(arr, minCount, maxCount) {
  const count = randomInt(minCount, maxCount);
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomDate(startYear, endYear) {
  const year = randomInt(startYear, endYear);
  const month = String(randomInt(1, 12)).padStart(2, '0');
  const day = String(randomInt(1, 28)).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateEmployee(id) {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const dept = pick(DEPARTMENTS);
  const role = pick(dept.roles);
  const cityData = pick(CITIES);

  const baseSalary = {
    Engineering: [70000, 150000],
    Marketing: [50000, 120000],
    Sales: [55000, 130000],
    HR: [50000, 110000],
    Finance: [55000, 125000],
    Product: [80000, 150000],
    Design: [65000, 130000],
    Operations: [55000, 115000],
  }[dept.name] || [50000, 100000];

  const salary = randomInt(baseSalary[0], baseSalary[1]);
  const streetNum = randomInt(100, 9999);
  const street = `${streetNum} ${pick(STREET_PREFIXES)}`;
  const zipCode = String(randomInt(10000, 99999));
  const joinDate = randomDate(2018, 2024);
  const lastReview = randomDate(2019, 2025);

  return {
    id: `emp-${id}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    department: dept.name,
    role,
    salary,
    joinDate,
    lastReview,
    isActive: Math.random() > 0.12,
    skills: pickMany(SKILLS, 2, 6),
    performanceRating: randomInt(1, 5),
    projectsCount: randomInt(0, 10),
    address: {
      street,
      city: cityData.city,
      state: cityData.state,
      zipCode,
      country: cityData.country,
    },
  };
}

const COUNT = 55;
const employees = Array.from({ length: COUNT }, (_, i) => generateEmployee(i + 1));

const outputPath = join(__dirname, '..', 'src', 'data', 'employees.json');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify({ employees }, null, 2), 'utf-8');

console.log(`Generated ${COUNT} employees → ${outputPath}`);
