import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Role, roleStyles } from '@/lib/constants';
import { Badge } from '../ui/badge';
import { DeleteUserButton, EditUserButton } from './UsersButtons';
import { fetchUsers } from '@/lib/actions/user/fetchUserActions';

const UsersTable = async ({
  page,
  query,
  userRole,
}: {
  page: number;
  query: string;
  userRole: Role;
}) => {
  const users = await fetchUsers(query, page);
  if (users.length === 0) return null;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="sr-only">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={roleStyles[user.role as keyof typeof roleStyles]}
              >
                {user.role}
              </Badge>
            </TableCell>
            {userRole !== 'user' && (
              <TableCell className="flex items-center justify-end gap-1">
                <EditUserButton id={user.id} />
                <DeleteUserButton id={user.id} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
