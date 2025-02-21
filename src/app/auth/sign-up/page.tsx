import React from 'react';
import SignUpForm from '@/components/auth/SignUpForm';
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
      <SignUpForm />
      <AuthFooter
        description="Já tem uma conta?"
        link="/auth/sign-in"
        linkText="Entrar"
      />
    </section>
  );
};

export default SignUpPage;
