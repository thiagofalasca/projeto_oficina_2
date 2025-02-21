'use client';

import { UserPlusIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IdentifierInput, IdentifierSchema } from '@/validations/workshop';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomInput from '../CustomInput';
import DialogForm from '../DialogForm';
import { adminEnrollStudent } from '@/actions/enrollment/enrollStudentActions';

const AddStudentModal = ({ workshopId }: { workshopId: string }) => {
  const [messageState, setMessageState] = useState<MessageState>({});
  const form = useForm<IdentifierInput>({
    resolver: zodResolver(IdentifierSchema),
    defaultValues: { identifier: '' },
  });

  const onSubmit = async (data: IdentifierInput) => {
    const result = await adminEnrollStudent(workshopId, data);
    setMessageState(result);
    if (result.validationErrors?.identifier) {
      form.setError('identifier', {
        message: result.validationErrors.identifier[0],
      });
    }
  };

  return (
    <DialogForm
      trigger={
        <Button className="base-btn green-btn">
          <UserPlusIcon className="h-5 w-5" />
          <span className="hidden md:block">Adicionar</span>
        </Button>
      }
      title="Adicionar Estudante"
      description="Informe o RA ou email do estudante para adicioná-lo ao workshop."
      form={form}
      onSubmit={onSubmit}
      submitText="Adicionar"
      loadingText="Adicionando..."
      messageState={messageState}
    >
      <CustomInput
        control={form.control}
        name="identifier"
        label="RA ou Email"
        placeholder="Digite o RA ou email do estudante"
      />
    </DialogForm>
  );
};

export default AddStudentModal;
