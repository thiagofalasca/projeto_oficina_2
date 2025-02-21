import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import AuthFooter from '@/components/auth/AuthFooter';
import ResetForm from '@/components/auth/ResetForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alterar Senha',
};

const ResetPage = () => {
  return (
    <section className="auth-card max-w-md">
      <HeaderBox
        className="text-3xl"
        title="Recuperação de Senha"
        subText="Digite seu email para alterar sua senha"
      />
      <ResetForm />
      <AuthFooter link="/auth/sign-in" linkText="Voltar para o login" />
    </section>
  );
};

export default ResetPage;
