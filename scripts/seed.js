import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    id: 1,
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '+96171234567',
    date_of_birth: '1985-06-15',
    job_title: 'Software Engineer',
    department: 'Engineering',
    salary: 2500,
    start_date: '2020-03-01',
    end_date: '2025-01-10'
  },
  {
    id: 2,
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone_number: '+96181987654',
    date_of_birth: '1990-09-22',
    job_title: 'Product Manager',
    department: 'Product',
    salary: 2800,
    start_date: '2019-07-15',
    end_date: '2025-01-10'
  },
  {
    id: 3,
    full_name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone_number: '+96171432109',
    date_of_birth: '1988-03-10',
    job_title: 'Data Analyst',
    department: 'Analytics',
    salary: 2200,
    start_date: '2021-01-10',
    end_date: '2025-01-10'
  }
];

const timesheets = [
  {
    id: 1,
    employee_id: 1,
    start_time: '2025-06-10 08:00:00',
    end_time: '2025-06-10 17:00:00',
    summary: 'Worked on feature development and bug fixes'
  },
  {
    id: 2,
    employee_id: 2,
    start_time: '2025-06-11 12:00:00',
    end_time: '2025-06-11 17:00:00',
    summary: 'Conducted product review and stakeholder meetings'
  },
  {
    id: 3,
    employee_id: 3,
    start_time: '2025-02-12 07:00:00',
    end_time: '2025-02-12 16:00:00',
    summary: 'Analyzed Q1 data and prepared reports'
  }
];


const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});

