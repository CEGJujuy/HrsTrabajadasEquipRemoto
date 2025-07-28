import { User, Project, Task, TimeEntry } from '../types';

// Datos mock para demostración
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@demo.com',
    name: 'Administrador',
    role: 'admin',
    avatar_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'empleado@demo.com',
    name: 'Juan Pérez',
    role: 'employee',
    avatar_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'maria@demo.com',
    name: 'María García',
    role: 'employee',
    avatar_url: null,
    created_at: new Date().toISOString()
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Desarrollo Web',
    description: 'Proyecto de desarrollo de sitio web corporativo',
    color: '#3B82F6',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'App Mobile',
    description: 'Desarrollo de aplicación móvil',
    color: '#10B981',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Marketing Digital',
    description: 'Campaña de marketing digital',
    color: '#F59E0B',
    status: 'active',
    created_at: new Date().toISOString()
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    project_id: '1',
    name: 'Diseño UI/UX',
    description: 'Crear mockups y prototipos',
    status: 'in_progress',
    assigned_to: '2',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    project_id: '1',
    name: 'Frontend Development',
    description: 'Implementar componentes React',
    status: 'pending',
    assigned_to: '2',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    project_id: '2',
    name: 'API Integration',
    description: 'Integrar APIs externas',
    status: 'in_progress',
    assigned_to: '3',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    project_id: '3',
    name: 'Content Creation',
    description: 'Crear contenido para redes sociales',
    status: 'completed',
    assigned_to: '3',
    created_at: new Date().toISOString()
  }
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    user_id: '2',
    project_id: '1',
    task_id: '1',
    start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    duration: 3600,
    description: 'Trabajando en los mockups del dashboard',
    location: 'Buenos Aires, Argentina',
    screenshot_url: null,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: '3',
    project_id: '2',
    task_id: '3',
    start_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration: 7200,
    description: 'Integración con API de pagos',
    location: 'Córdoba, Argentina',
    screenshot_url: null,
    created_at: new Date().toISOString()
  }
];