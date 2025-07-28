import React, { useState } from 'react';
import { Plus, Calendar, Clock } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { useAuth } from '../hooks/useAuth';
import { Task } from '../types';

interface ManualEntryProps {
  tasks: Task[];
}

export function ManualEntry({ tasks }: ManualEntryProps) {
  const { profile } = useAuth();
  const { addManualEntry } = useTimer(profile?.id || '');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTask || !startDate || !startTime || !endDate || !endTime) return;

    const task = tasks.find(t => t.id === selectedTask);
    if (!task) return;

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }

    await addManualEntry(
      task.id,
      task.project_id,
      startDateTime,
      endDateTime,
      description
    );

    // Reset form
    setSelectedTask('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setDescription('');
    setIsOpen(false);
  };

  const availableTasks = tasks.filter(task => 
    task.assigned_to.includes(profile?.id || '')
  );

  if (!isOpen) {
    return (
      <div className="card">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full btn-outline flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Entrada Manual</span>
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Entrada Manual</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Tarea</label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="input mt-1"
            required
          >
            <option value="">Seleccionar tarea</option>
            {availableTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.name} - {task.project?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Fecha de inicio</label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Hora de inicio</label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Fecha de fin</label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Hora de fin</label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="label">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el trabajo realizado..."
            className="input mt-1 min-h-[80px] resize-none"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 btn-primary"
          >
            Guardar Entrada
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}