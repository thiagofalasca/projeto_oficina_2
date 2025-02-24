import React from 'react';
import UserForm from '@/components/UserForm';
import HeaderBox from '@/components/HeaderBox';
import AuthFooter from '@/components/auth/AuthFooter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar Conta',
};

const SignUpPage = () => {
  return (
    <section className="auth-card max-w-2xl">
      <HeaderBox title="Criar Conta" subText="Por favor, preencha seus dados" />
      <UserForm />
      <AuthFooter
        description="Já tem uma conta?"
        link="/auth/sign-in"
        linkText="Entrar"
      />
    </section>
  );
};

export default SignUpPage;
