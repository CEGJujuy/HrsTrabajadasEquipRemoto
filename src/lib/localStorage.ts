import { User, Project, Task, TimeEntry } from '../types';
import { mockUsers, mockProjects, mockTasks, mockTimeEntries } from './mockData';

const STORAGE_KEYS = {
  USERS: 'timetracker_users',
  PROJECTS: 'timetracker_projects',
  TASKS: 'timetracker_tasks',
  TIME_ENTRIES: 'timetracker_entries',
  CURRENT_USER: 'timetracker_current_user',
  ACTIVE_TIMER: 'timetracker_active_timer'
};

// Inicializar datos mock si no existen
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(mockProjects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(mockTasks));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES)) {
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(mockTimeEntries));
  }
};

// Funciones para usuarios
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const authenticateUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  // Simulamos autenticación simple (en producción sería más seguro)
  if (user && password === 'password') {
    setCurrentUser(user);
    return user;
  }
  return null;
};

// Funciones para proyectos
export const getProjects = (): Project[] => {
  const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return projects ? JSON.parse(projects) : [];
};

export const saveProject = (project: Project) => {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

// Funciones para tareas
export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
  return tasks ? JSON.parse(tasks) : [];
};

export const getTasksByUser = (userId: string): Task[] => {
  const tasks = getTasks();
  return tasks.filter(task => task.assigned_to === userId);
};

export const saveTask = (task: Task) => {
  const tasks = getTasks();
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  
  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }
  
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

// Funciones para entradas de tiempo
export const getTimeEntries = (): TimeEntry[] => {
  const entries = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
  return entries ? JSON.parse(entries) : [];
};

export const getTimeEntriesByUser = (userId: string): TimeEntry[] => {
  const entries = getTimeEntries();
  return entries.filter(entry => entry.user_id === userId);
};

export const saveTimeEntry = (entry: TimeEntry) => {
  const entries = getTimeEntries();
  const existingIndex = entries.findIndex(e => e.id === entry.id);
  
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  
  localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(entries));
};

// Funciones para temporizador activo
export const getActiveTimer = () => {
  const timer = localStorage.getItem(STORAGE_KEYS.ACTIVE_TIMER);
  return timer ? JSON.parse(timer) : null;
};

export const setActiveTimer = (timer: any) => {
  if (timer) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMER, JSON.stringify(timer));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMER);
  }
};

// Función para limpiar todos los datos
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};