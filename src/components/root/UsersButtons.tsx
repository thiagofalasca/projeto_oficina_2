import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '../ui/button';
import ConfirmationDialog from '../ConfirmationDialog';
import { deleteUser } from '@/lib/actions/user/deleteUserAction';

export const CreateUserButton = () => {
  return (
    <Link href="/users/create" className="green-btn">
      <span className="hidden md:block">Criar Usuário</span>
      <PlusIcon className="h-5 w-5 md:ml-4" />
    </Link>
  );
};

export const EditUserButton = ({ id }: { id: string }) => {
  return (
    <Link href={`/users/edit?id=${id}`} className="edit-workshop-btn bg-white">
      <PencilIcon className="h-4 w-4" />
    </Link>
  );
};

export const DeleteUserButton = ({ id }: { id: string }) => {
  return (
    <ConfirmationDialog
      trigger={
        <Button variant="outline" className="text-red-600 hover:text-red-700">
          <TrashIcon className="h-4 w-4" />
        </Button>
      }
      title="Deletar Usuário"
      description="Tem certeza de que deseja deletar este usuário do sistema?"
      onConfirm={deleteUser.bind(null, id)}
      confirmText="Deletar"
      loadingText="Deletando..."
    />
  );
};
