import { Mail } from 'lucide-react';
import React from 'react';
import HeaderBox from '../HeaderBox';
import AuthFooter from '@/components/auth/AuthFooter';

interface MailCardProps {
  type: 'confirmation' | 'reset';
}

const MailCard = ({ type }: MailCardProps) => {
  const isConfirmation = type === 'confirmation';
  return (
    <section className="auth-card max-w-3xl">
      <Mail className="auth-icon text-blue-600" />
      <HeaderBox
        className="text-3xl"
        title={isConfirmation ? 'Confirmação de Conta' : 'Alteração de Senha'}
      />
      <div className="text-center text-gray-700">
        <p>
          Enviamos um link de{' '}
          {isConfirmation ? 'confirmação' : 'alteração de senha'} para o seu
          endereço de e-mail. Por favor, verifique sua caixa de entrada e clique
          no link para prosseguir. <br className="mb-5" />
          Se você não encontrar o e-mail, verifique na sua pasta de spam.
        </p>
      </div>
      <AuthFooter link="/auth/sign-in" linkText="Voltar para o login" />
    </section>
  );
};

export default MailCard;
