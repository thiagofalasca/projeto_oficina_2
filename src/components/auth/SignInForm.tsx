'use client';

import { signInSchema, signInInput } from '@/validations/auth';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import CustomInput from '@/components/CustomInput';
import FormMessage from '@/components/FormMessage';
import FormButton from '@/components/FormButton';
import Link from 'next/link';
import { signInAction } from '@/actions/auth/signInAction';
import { useFormSubmit } from '@/hooks/useFormSubmit';

const SignInForm = () => {
  const form = useForm<signInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const { isPending, messageState, control, handleSubmit, onSubmit } =
    useFormSubmit(form, signInAction);

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
        <CustomInput
          control={control}
          name="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          description={
            <div className="mt-1 flex gap-1 text-sm">
              <p className="text-gray-600">Esqueceu sua senha?</p>
              <Link href={'/auth/reset'} className="auth-link text-blue-600">
                Recuperar senha
              </Link>
            </div>
          }
        />
        {messageState && (
          <FormMessage
            success={messageState.success}
            message={messageState.message}
          />
        )}
        <FormButton isLoading={isPending}>Entrar</FormButton>
      </form>
    </Form>
  );
};

export default SignInForm;
