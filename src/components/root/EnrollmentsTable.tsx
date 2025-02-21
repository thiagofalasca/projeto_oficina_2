import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { RemoveStudentButton } from '@/components/root/EnrollmentButtons';
import { Role } from '@/lib/constants';
import { fetchEnrollments } from '@/actions/enrollment/fetchEnrollmentAction';

const EnrollmentsTable = async ({
  workshopId,
  page,
  userRole,
}: {
  workshopId: string;
  page: number;
  userRole: Role;
}) => {
  const enrollments = await fetchEnrollments(workshopId, page);

  if (enrollments.length === 0) {
    return (
      <div className="flex-center h-32 rounded-md border border-dashed text-gray-500">
        Nenhum participante inscrito
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          {userRole !== 'user' && (
            <TableHead className="sr-only">Ações</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrollments.map((enrollment) => (
          <TableRow key={enrollment.id}>
            <TableCell>{enrollment.name}</TableCell>
            <TableCell>{enrollment.email}</TableCell>
            {userRole !== 'user' && (
              <TableCell className="text-right">
                <RemoveStudentButton
                  studentId={enrollment.id}
                  workshopId={workshopId}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EnrollmentsTable;
