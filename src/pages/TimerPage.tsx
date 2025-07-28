import React, { useState, useEffect } from 'react';
import { Timer } from '../components/Timer';
import { ManualEntry } from '../components/ManualEntry';
import { RecentEntries } from '../components/RecentEntries';
import { supabase } from '../lib/supabase';
import { Task, Project } from '../types';
import { useAuth } from '../hooks/useAuth';

export function TimerPage() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [profile?.id]);

  const fetchData = async () => {
    if (!profile?.id) return;

    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active');

      if (projectsError) throw projectsError;

      // Fetch tasks assigned to user
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*)
        `)
        .contains('assigned_to', [profile.id])
        .in('status', ['pending', 'in_progress']);

      if (tasksError) throw tasksError;

      setProjects(projectsData || []);
      setTasks(tasksData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registro de Tiempo</h1>
        <p className="text-gray-600">Gestiona tu tiempo de trabajo de manera eficiente</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Timer tasks={tasks} projects={projects} />
          <ManualEntry tasks={tasks} />
        </div>
        
        <div>
          <RecentEntries />
        </div>
      </div>
    </div>
  );
}