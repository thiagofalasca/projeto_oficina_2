'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Role, ROLES } from '@/lib/constants';
import UserForm from './UserForm';

interface CreateUserFormProps {
  userRole: Role;
  userToEdit?: User | StudentUser | ProfessorUser;
}

export function CreateUserForm({ userRole, userToEdit }: CreateUserFormProps) {
  const [selectedRole, setSelectedRole] = React.useState<Role>('user');
  const roleForForm = userToEdit
    ? userToEdit.role
    : userRole === 'admin'
      ? 'user'
      : selectedRole;

  return (
    <section className="space-y-4">
      {userRole !== 'admin' && !userToEdit && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Cargo</label>
          <Select
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value as Role)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o cargo" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => {
                return (
                  <SelectItem value={role} key={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="rounded-lg border border-gray-200 p-4">
        <UserForm role={roleForForm} isSignUp={false} userToEdit={userToEdit} />
      </div>
    </section>
  );
}
