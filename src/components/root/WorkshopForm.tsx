'use client';

import { workshopInput, workshopSchema } from '@/validations/workshop';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '../ui/form';
import CustomInput from '../CustomInput';
import FormButton from '../FormButton';
import FormMessage from '../FormMessage';
import CustomSelect from '../CustomSelect';
import { formatDate, getStatusOptions } from '@/lib/utils';
import { Role, WorkshopStatus } from '@/lib/constants';
import { createWorkshop } from '@/actions/workshop/createWorkshopAction';
import { updateWorkshop } from '@/actions/workshop/updateWorkshopAction';
import { useFormSubmit } from '@/hooks/useFormSubmit';

interface WorkshopFormProps {
  professors: ProfessorOption[];
  workshop?: Workshop;
  type?: 'create' | 'edit';
  userRole: Role;
  professorId?: string;
}

const WorkshopForm = ({
  professors,
  workshop,
  type = 'create',
  userRole,
  professorId,
}: WorkshopFormProps) => {
  const form = useForm<workshopInput>({
    resolver: zodResolver(workshopSchema),
    defaultValues: workshop
      ? {
          title: workshop.title,
          description: workshop.description || '',
          professorId: workshop.professor.id,
          startDate: formatDate(workshop.startDate),
          endDate: formatDate(workshop.endDate),
          status: workshop.status as WorkshopStatus,
          key: workshop.key || '',
        }
      : {
          title: '',
          description: '',
          professorId: userRole === 'admin' ? professorId : '',
          startDate: '',
          endDate: '',
          status: undefined,
          key: '',
        },
  });

  const { isPending, messageState, control, handleSubmit, onSubmit } =
    useFormSubmit(
      form,
      workshop?.id ? updateWorkshop.bind(null, workshop.id) : createWorkshop
    );

  const statusOptions = getStatusOptions();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {userRole === 'superadmin' && (
          <CustomSelect
            control={control}
            name="professorId"
            label="Responsável"
            placeholder="Selecione o responsável"
            options={professors}
          />
        )}
        <CustomInput
          control={control}
          name="title"
          label="Título"
          placeholder="Digite o título"
          maskName="name"
        />
        <CustomInput
          control={control}
          type="textarea"
          name="description"
          label="Descrição"
          placeholder="Digite a descrição (Opicional)"
        />
        <div className="flex gap-4">
          <CustomInput
            control={control}
            name="startDate"
            label="Data de início"
            placeholder="Digite a data de início"
            maskName="date"
          />
          <CustomInput
            control={control}
            name="endDate"
            label="Data de término"
            placeholder="Digite a data de término"
            maskName="date"
          />
        </div>
        <CustomSelect
          control={control}
          name="status"
          label="Status"
          placeholder="Selecione o status"
          options={statusOptions}
        />
        <CustomInput
          control={control}
          name="key"
          label="Chave de Acesso"
          placeholder="Digite a chave de acesso (Opicional)"
        />
        {messageState && (
          <FormMessage
            success={messageState.success}
            message={messageState.message}
          />
        )}
        <FormButton isLoading={isPending}>
          {type === 'create' ? 'Cadastrar Workshop' : 'Salvar Alterações'}
        </FormButton>
      </form>
    </Form>
  );
};

export default WorkshopForm;
