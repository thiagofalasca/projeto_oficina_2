import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import {
  cancelUserEnrollment,
  removeUserEnrollment,
} from '@/actions/enrollment/deleteEnrollmentAction';
import AddStudentModal from '@/components/root/AddStudentModal';
import ConfirmationDialog from '../ConfirmationDialog';

export const AddStudentButton = ({ workshopId }: { workshopId: string }) => {
  return <AddStudentModal workshopId={workshopId} />;
};

export const RemoveStudentButton = ({
  studentId,
  workshopId,
}: {
  studentId: string;
  workshopId: string;
}) => {
  return (
    <ConfirmationDialog
      trigger={
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700"
          data-testid="remove-student-button"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      }
      title="Remover Estudante"
      description="Tem certeza de que deseja remover este aluno do workshop?"
      onConfirm={removeUserEnrollment.bind(null, studentId, workshopId)}
      confirmText="Remover"
      loadingText="Removendo..."
    />
  );
};

export const CancelEnrollmentButton = ({
  workshopId,
}: {
  workshopId: string;
}) => {
  return (
    <ConfirmationDialog
      trigger={<Button variant="destructive">Cancelar Inscrição</Button>}
      title="Cancelar Inscrição"
      description="Tem certeza de que deseja cancelar sua inscrição neste workshop?"
      onConfirm={cancelUserEnrollment.bind(null, workshopId)}
      confirmText="Cancelar Inscrição"
      loadingText="Cancelando..."
    />
  );
};
