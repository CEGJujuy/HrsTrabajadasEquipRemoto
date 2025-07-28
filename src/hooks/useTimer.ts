import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { TimeEntry } from '../types';
import { getCurrentLocation, captureScreenshot } from '../lib/utils';
import { toast } from 'sonner';

export function useTimer(userId: string) {
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Check for active timer on mount
    checkActiveTimer();
  }, [userId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeTimer && !activeTimer.end_time) {
      interval = setInterval(() => {
        const startTime = new Date(activeTimer.start_time);
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const checkActiveTimer = async () => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          task:tasks(*),
          project:projects(*)
        `)
        .eq('user_id', userId)
        .is('end_time', null)
        .order('start_time', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setActiveTimer(data);
        const startTime = new Date(data.start_time);
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
        setElapsedTime(elapsed);
      }
    } catch (error) {
      // No active timer found
    }
  };

  const startTimer = async (taskId: string, projectId: string, description?: string) => {
    try {
      let location;
      let screenshotUrl;

      // Get location if permission granted
      try {
        location = await getCurrentLocation();
      } catch (error) {
        console.log('Location not available:', error);
      }

      // Capture screenshot
      try {
        const screenshot = await captureScreenshot();
        // In a real app, you would upload this to storage
        screenshotUrl = screenshot;
      } catch (error) {
        console.log('Screenshot not available:', error);
      }

      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          user_id: userId,
          task_id: taskId,
          project_id: projectId,
          start_time: new Date().toISOString(),
          description,
          is_manual: false,
          location,
          screenshot_url: screenshotUrl,
        })
        .select(`
          *,
          task:tasks(*),
          project:projects(*)
        `)
        .single();

      if (error) throw error;

      setActiveTimer(data);
      setElapsedTime(0);
      toast.success('Temporizador iniciado');
    } catch (error) {
      console.error('Error starting timer:', error);
      toast.error('Error al iniciar el temporizador');
    }
  };

  const stopTimer = async () => {
    if (!activeTimer) return;

    try {
      const endTime = new Date();
      const startTime = new Date(activeTimer.start_time);
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

      const { error } = await supabase
        .from('time_entries')
        .update({
          end_time: endTime.toISOString(),
          duration,
        })
        .eq('id', activeTimer.id);

      if (error) throw error;

      setActiveTimer(null);
      setElapsedTime(0);
      toast.success(`Temporizador detenido. Tiempo registrado: ${Math.floor(duration / 60)}h ${duration % 60}m`);
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast.error('Error al detener el temporizador');
    }
  };

  const addManualEntry = async (
    taskId: string,
    projectId: string,
    startTime: Date,
    endTime: Date,
    description?: string
  ) => {
    try {
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

      const { error } = await supabase
        .from('time_entries')
        .insert({
          user_id: userId,
          task_id: taskId,
          project_id: projectId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration,
          description,
          is_manual: true,
        });

      if (error) throw error;

      toast.success('Entrada manual agregada');
    } catch (error) {
      console.error('Error adding manual entry:', error);
      toast.error('Error al agregar entrada manual');
    }
  };

  return {
    activeTimer,
    elapsedTime,
    startTimer,
    stopTimer,
    addManualEntry,
  };
}