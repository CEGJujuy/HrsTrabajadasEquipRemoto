export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  avatar_url?: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  created_by: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  project_id: string;
  assigned_to: string[];
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  project?: Project;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  task_id: string;
  project_id: string;
  start_time: string;
  end_time?: string;
  duration?: number; // in minutes
  description?: string;
  is_manual: boolean;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  screenshot_url?: string;
  created_at: string;
  user?: User;
  task?: Task;
  project?: Project;
}

export interface DashboardStats {
  totalHours: number;
  totalProjects: number;
  totalEmployees: number;
  activeTimers: number;
  hoursThisWeek: number;
  hoursThisMonth: number;
}

export interface ProjectReport {
  project: Project;
  totalHours: number;
  totalTasks: number;
  employees: {
    user: User;
    hours: number;
  }[];
}

export interface EmployeeReport {
  user: User;
  totalHours: number;
  projects: {
    project: Project;
    hours: number;
  }[];
}