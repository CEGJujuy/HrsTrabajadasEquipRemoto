/*
  # Esquema inicial para TimeTracker

  1. Nuevas Tablas
    - `users` - Perfiles de usuario con roles
    - `projects` - Proyectos de trabajo
    - `tasks` - Tareas asignadas a proyectos
    - `time_entries` - Registros de tiempo trabajado

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para usuarios autenticados
    - Políticas específicas para administradores

  3. Funciones
    - Trigger para crear perfil de usuario automáticamente
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  color text NOT NULL DEFAULT '#6b7280',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  assigned_to uuid[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Time entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration integer, -- in minutes
  description text,
  is_manual boolean NOT NULL DEFAULT false,
  location jsonb,
  screenshot_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Projects policies
CREATE POLICY "Users can read active projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tasks policies
CREATE POLICY "Users can read assigned tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = ANY(assigned_to) OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Time entries policies
CREATE POLICY "Users can read own time entries"
  ON time_entries
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert own time entries"
  ON time_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own time entries"
  ON time_entries
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all time entries"
  ON time_entries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Insert demo data
INSERT INTO users (id, email, name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@demo.com', 'Administrador Demo', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'empleado@demo.com', 'Empleado Demo', 'employee')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, name, description, color, created_by) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Desarrollo Web', 'Proyecto de desarrollo de aplicación web', '#3b82f6', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002', 'Marketing Digital', 'Campaña de marketing digital', '#10b981', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, name, description, project_id, assigned_to) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Diseño de interfaz', 'Crear mockups y prototipos', '00000000-0000-0000-0000-000000000001', ARRAY['00000000-0000-0000-0000-000000000002']),
  ('00000000-0000-0000-0000-000000000002', 'Desarrollo frontend', 'Implementar componentes React', '00000000-0000-0000-0000-000000000001', ARRAY['00000000-0000-0000-0000-000000000002']),
  ('00000000-0000-0000-0000-000000000003', 'Análisis de mercado', 'Investigar competencia y tendencias', '00000000-0000-0000-0000-000000000002', ARRAY['00000000-0000-0000-0000-000000000002'])
ON CONFLICT (id) DO NOTHING;