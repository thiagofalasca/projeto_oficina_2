'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyInput, KeySchema } from '@/validations/workshop';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomInput from '../CustomInput';
import { selfEnrollStudent } from '@/actions/enrollment/enrollStudentActions';
import WorkshopCard from '@/components/root/WorkshopCard';
import DialogForm from '../DialogForm';

const EnrollStudentModal = ({ workshop }: { workshop: Workshop }) => {
  const [messageState, setMessageState] = useState<MessageState>({});
  const form = useForm<KeyInput>({
    resolver: zodResolver(KeySchema),
    defaultValues: { key: '' },
  });

  const onSubmit = async (data: KeyInput) => {
    const result = await selfEnrollStudent(workshop, data);
    setMessageState(result);
    if (result.validationErrors?.key) {
      form.setError('key', {
        message: result.validationErrors.key[0],
      });
    }
  };

  return (
    <DialogForm
      trigger={<WorkshopCard workshop={workshop} />}
      title="Deseja se inscrever?"
      description={
        workshop.key
          ? 'Digite a chave do workshop para se inscrever.'
          : 'Clique em inscrever para se inscrever no workshop.'
      }
      form={form}
      onSubmit={onSubmit}
      submitText="Inscrever-se"
      loadingText="Inscrevendo..."
      messageState={messageState}
    >
      {workshop.key && (
        <CustomInput
          control={form.control}
          name="key"
          label="Chave de inscrição"
          placeholder="Digite a chave de inscrição"
        />
      )}
    </DialogForm>
  );
};

export default EnrollStudentModal;
