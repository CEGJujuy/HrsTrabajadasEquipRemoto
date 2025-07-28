import React, { useState } from 'react';
import { Play, Pause, Clock, MapPin, Camera } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { useAuth } from '../hooks/useAuth';
import { formatDuration } from '../lib/utils';
import { Task, Project } from '../types';

interface TimerProps {
  tasks: Task[];
  projects: Project[];
}

export function Timer({ tasks, projects }: TimerProps) {
  const { profile } = useAuth();
  const { activeTimer, elapsedTime, startTimer, stopTimer } = useTimer(profile?.id || '');
  const [selectedTask, setSelectedTask] = useState('');
  const [description, setDescription] = useState('');

  const handleStart = async () => {
    if (!selectedTask) return;
    
    const task = tasks.find(t => t.id === selectedTask);
    if (!task) return;

    await startTimer(task.id, task.project_id, description);
    setDescription('');
  };

  const handleStop = async () => {
    await stopTimer();
  };

  const availableTasks = tasks.filter(task => 
    task.assigned_to.includes(profile?.id || '')
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Temporizador</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Tiempo actual: {formatDuration(elapsedTime)}</span>
        </div>
      </div>

      {activeTimer ? (
        <div className="space-y-4">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary-900">{activeTimer.task?.name}</h3>
                <p className="text-sm text-primary-700">{activeTimer.project?.name}</p>
                {activeTimer.description && (
                  <p className="text-sm text-primary-600 mt-1">{activeTimer.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-900">
                  {formatDuration(elapsedTime)}
                </div>
                <div className="text-sm text-primary-700">
                  Iniciado: {new Date(activeTimer.start_time).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            
            {activeTimer.location && (
              <div className="flex items-center mt-3 text-sm text-primary-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{activeTimer.location.address || `${activeTimer.location.latitude}, ${activeTimer.location.longitude}`}</span>
              </div>
            )}
            
            {activeTimer.screenshot_url && (
              <div className="flex items-center mt-2 text-sm text-primary-600">
                <Camera className="h-4 w-4 mr-1" />
                <span>Captura de pantalla registrada</span>
              </div>
            )}
          </div>

          <button
            onClick={handleStop}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <Pause className="h-5 w-5" />
            <span>Detener Temporizador</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="label">Tarea</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="input mt-1"
            >
              <option value="">Seleccionar tarea</option>
              {availableTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name} - {task.project?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe en qué vas a trabajar..."
              className="input mt-1 min-h-[80px] resize-none"
            />
          </div>

          <button
            onClick={handleStart}
            disabled={!selectedTask}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-5 w-5" />
            <span>Iniciar Temporizador</span>
          </button>

          <div className="text-sm text-gray-500 space-y-1">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Se registrará tu ubicación automáticamente</span>
            </div>
            <div className="flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              <span>Se tomará una captura de pantalla al iniciar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}