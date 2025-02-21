import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import SignInForm from '@/components/auth/SignInForm';
import AuthFooter from '@/components/auth/AuthFooter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrar',
};

const SignInPage = () => {
  return (
    <section className="auth-card max-w-md">
      <HeaderBox title="Entrar" subText="Por favor, preencha seus dados" />
      <SignInForm />
      <AuthFooter
        description="Não tem uma conta?"
        link="/auth/sign-up"
        linkText="Criar Conta"
      />
    </section>
  );
};

export default SignInPage;
