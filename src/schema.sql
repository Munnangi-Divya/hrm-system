CREATE TABLE IF NOT EXISTS organisations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  organisation_id INTEGER REFERENCES organisations(id),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (organisation_id, email)
);

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  organisation_id INTEGER REFERENCES organisations(id),
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  position TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  organisation_id INTEGER REFERENCES organisations(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employee_teams (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (employee_id, team_id)
);

CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  organisation_id INTEGER REFERENCES organisations(id),
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  meta JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
