import HeaderBox from '@/components/HeaderBox';
import Breadcrumbs from '@/components/root/Breadcrumbs';
import { getCurrentUser } from '@/actions/auth/authActions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';
import { CreateUserForm } from '@/components/CreateUserForm';

export const metadata: Metadata = {
  title: 'Criar Usuário',
};

const CreateUserPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  if (user.role === 'user') redirect('/workshops');

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Usuários', href: '/users' },
          {
            label: 'Criar',
            href: `/users/create`,
            active: true,
          },
        ]}
      />
      <div className="mx-auto max-w-2xl space-y-8">
        <HeaderBox
          title="Criar Usuário"
          subText="Selecione o cargo e preencha os campos para criar um novo usuário."
          className="text-3xl"
        />
        <CreateUserForm userRole={user.role} />
      </div>
    </div>
  );
};

export default CreateUserPage;
