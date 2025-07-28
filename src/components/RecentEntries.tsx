import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TimeEntry } from '../types';
import { formatDuration, formatDate, formatTime } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

export function RecentEntries() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, [profile?.id]);

  const fetchEntries = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          task:tasks(name),
          project:projects(name, color)
        `)
        .eq('user_id', profile.id)
        .not('end_time', 'is', null)
        .order('start_time', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Entradas Recientes</h3>
      
      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No hay entradas registradas aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.project?.color || '#6b7280' }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{entry.task?.name}</h4>
                    <p className="text-sm text-gray-600">{entry.project?.name}</p>
                  </div>
                </div>
                
                {entry.description && (
                  <p className="text-sm text-gray-500 mt-1 ml-6">{entry.description}</p>
                )}
                
                <div className="flex items-center space-x-4 mt-2 ml-6 text-xs text-gray-400">
                  <span>
                    {formatDate(new Date(entry.start_time))} • {formatTime(new Date(entry.start_time))} - {formatTime(new Date(entry.end_time!))}
                  </span>
                  {entry.is_manual && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Manual</span>
                  )}
                  {entry.location && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Ubicación registrada</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatDuration(entry.duration || 0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}