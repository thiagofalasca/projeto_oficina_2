'use client';

import { resetSchema, resetInput } from '@/lib/validations/user';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import CustomInput from '@/components/CustomInput';
import FormMessage from '@/components/FormMessage';
import FormButton from '@/components/FormButton';
import { resetAction } from '@/actions/auth/resetAction';
import { useFormSubmit } from '@/hooks/useFormSubmit';

const ResetForm = () => {
  const form = useForm<resetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });

  const { isPending, messageState, control, handleSubmit, onSubmit } =
    useFormSubmit(form, resetAction);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          control={control}
          name="email"
          label="Email"
          placeholder="Digite seu email"
          maskName="email"
        />
        {messageState && (
          <FormMessage
            success={messageState.success}
            message={messageState.message}
          />
        )}
        <FormButton isLoading={isPending}>Alterar senha</FormButton>
      </form>
    </Form>
  );
};

export default ResetForm;
