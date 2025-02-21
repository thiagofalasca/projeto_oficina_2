import React, { Suspense } from 'react';
import NewPassword from '@/components/auth/NewPassword';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nova Senha',
};

const NewPasswordPage = () => {
  return (
    <Suspense>
      <NewPassword />
    </Suspense>
  );
};

export default NewPasswordPage;
