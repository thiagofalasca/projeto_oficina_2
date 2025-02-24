'use client';

import { newPasswordSchema, newPasswordInput } from '@/lib/validations/user';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import CustomInput from '@/components/CustomInput';
import FormMessage from '@/components/FormMessage';
import FormButton from '@/components/FormButton';
import { useSearchParams } from 'next/navigation';
import AuthFooter from '@/components/auth/AuthFooter';
import HeaderBox from '@/components/HeaderBox';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { newPasswordAction } from '@/actions/auth/newPasswordAction';

const NewPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [messageState, setMessageState] = useState<MessageState>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<newPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, control, setError } = form;

  const onSubmit = async (data: newPasswordInput) => {
    startTransition(async () => {
      const result = await newPasswordAction({ passwordData: data, token });
      setMessageState(result);

      if (result.validationErrors) {
        Object.entries(result.validationErrors).forEach(([field, messages]) => {
          setError(field as keyof newPasswordInput, { message: messages[0] });
        });
      }

      if (result.success) {
        setIsSuccess(true);
      }
    });
  };

  return (
    <section className="auth-card max-w-md">
      {isSuccess && (
        <CheckCircleIcon className="auth-icon mb-[-20px] text-emerald-500" />
      )}
      <HeaderBox
        className={isSuccess ? 'text-emerald-500' : ''}
        title={isSuccess ? 'Senha Alterada' : 'Alterar Senha'}
        subText={
          isSuccess
            ? 'Sua senha foi alterada com sucesso! Você já pode fazer login com sua nova senha.'
            : 'Digite sua nova senha'
        }
      />
      {!isSuccess && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              control={control}
              name="password"
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
            />
            <CustomInput
              control={control}
              name="confirmPassword"
              label="Confirme sua senha"
              placeholder="Digite sua senha novamente"
              type="password"
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
      )}
      <AuthFooter link="/auth/sign-in" linkText="Voltar para o login" />
    </section>
  );
};

export default NewPassword;
