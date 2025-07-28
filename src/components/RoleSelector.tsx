import React, { useState } from 'react';
import { User, Shield, Clock } from 'lucide-react';
import { User as UserType } from '../types';
import { mockUsers } from '../lib/mockData';

interface RoleSelectorProps {
  onUserSelect: (user: UserType) => void;
}

export function RoleSelector({ onUserSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee' | null>(null);

  const adminUsers = mockUsers.filter(user => user.role === 'admin');
  const employeeUsers = mockUsers.filter(user => user.role === 'employee');

  const handleUserSelect = (user: UserType) => {
    onUserSelect(user);
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-primary-600 p-3 rounded-full">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">TimeTracker</h2>
            <p className="mt-2 text-sm text-gray-600">
              Selecciona tu rol para acceder al sistema
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setSelectedRole('admin')}
              className="w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 hover:border-primary-300"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Administrador</h3>
                  <p className="text-sm text-gray-600">
                    Acceso completo al sistema, dashboard, proyectos y reportes
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('employee')}
              className="w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 hover:border-primary-300"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Empleado</h3>
                  <p className="text-sm text-gray-600">
                    Registro de tiempo, tareas asignadas y reportes personales
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const users = selectedRole === 'admin' ? adminUsers : employeeUsers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-primary-600 p-3 rounded-full">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">TimeTracker</h2>
          <p className="mt-2 text-sm text-gray-600">
            Selecciona un usuario {selectedRole === 'admin' ? 'administrador' : 'empleado'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-3">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedRole(null)}
            className="w-full mt-4 btn-secondary"
          >
            Volver a selección de rol
          </button>
        </div>
      </div>
    </div>
  );
}