import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '../ui/button';
import { deleteWorkshop } from '@/actions/workshop/deleteWorkshopAtcion';
import ConfirmationDialog from '../ConfirmationDialog';
import { finishWorkshop } from '@/lib/actions/workshop/finishWorkshopAction';

export const CreateWorkshopButton = () => {
  return (
    <Link href="/workshops/create" className="green-btn">
      <span className="hidden md:block">Criar Workshop</span>
      <PlusIcon className="h-5 w-5 md:ml-4" />
    </Link>
  );
};

export const EditWorkshopButton = ({ id }: { id: string }) => {
  return (
    <Link href={`/workshops/${id}/edit`} className="edit-workshop-btn">
      <PencilIcon className="h-4 w-4" />
      Editar
    </Link>
  );
};

export const DeleteWorkshopButton = ({ id }: { id: string }) => {
  const deleteWorkshopWithId = deleteWorkshop.bind(null, id);

  return (
    <ConfirmationDialog
      trigger={
        <Button variant="outline">
          <TrashIcon className="mr-2 h-4 w-4" />
          Deletar
        </Button>
      }
      title="Você tem certeza?"
      description="Esta ação não pode ser desfeita. Isso excluirá permanentemente o workshop e removerá os dados do servidor."
      onConfirm={deleteWorkshopWithId}
      confirmText="Deletar"
      loadingText="Deletando..."
    />
  );
};

export const FinishWorkshopButton = ({ id }: { id: string }) => {
  const finishWorkshopWithId = finishWorkshop.bind(null, id);

  return (
    <ConfirmationDialog
      trigger={
        <Button variant="outline">
          <CheckIcon className="mr-2 h-4 w-4" />
          Finalizar
        </Button>
      }
      title="Você tem certeza?"
      description="Esta ação não pode ser desfeita. Isso marcará o workshop como 'Completo' e gerará certificados para todos os participantes."
      onConfirm={finishWorkshopWithId}
      confirmText="Finalizar"
      loadingText="Gerando certificados..."
    />
  );
};
