import HeaderBox from '@/components/HeaderBox';
import Breadcrumbs from '@/components/root/Breadcrumbs';
import { getCurrentRole } from '@/actions/auth/authActions';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { fetchUserById } from '@/lib/actions/user/fetchUserActions';
import { CreateUserForm } from '@/components/CreateUserForm';

export const metadata: Metadata = {
  title: 'Editar Usuário',
};

const EditUserPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) => {
  const role = await getCurrentRole();
  if (!role) redirect('/api/auth/sign-out');
  if (role === 'user') redirect('/workshops');

  const params = await searchParams;
  const id = params.id;

  if (!id) notFound();

  const userToEdit = await fetchUserById(id);
  if (!userToEdit) notFound();

  return (
    <div className="h-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Usuários', href: '/users' },
          {
            label: 'Editar',
            href: `/users/edit?id=${id}`,
            active: true,
          },
        ]}
      />
      <div className="mx-auto max-w-2xl space-y-8">
        <HeaderBox
          title="Editar Usuário"
          subText="Preencha os campos para editar o usuário."
          className="text-3xl"
        />
        <CreateUserForm userRole={role} userToEdit={userToEdit} />
      </div>
    </div>
  );
};

export default EditUserPage;
