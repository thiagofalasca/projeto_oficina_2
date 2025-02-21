import HeaderBox from '@/components/HeaderBox';
import Breadcrumbs from '@/components/root/Breadcrumbs';
import WorkshopForm from '@/components/root/WorkshopForm';
import { getCurrentUser } from '@/actions/auth/authActions';
import {
  getCurrentProfessor,
  fetchProfessorOptions,
} from '@/actions/professorActions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
  title: 'Criar Workshop',
};

const CreateWorkshopPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  if (user.role === 'user') redirect('/workshops');

  let professorId: string | null = null;
  let professorOptions: ProfessorOption[] = [];

  if (user.role === 'admin') {
    professorId = await getCurrentProfessor();
    if (!professorId) {
      throw new Error('Erro ao buscar professor por userId');
    }
  } else if (user.role === 'superadmin') {
    professorOptions = await fetchProfessorOptions();
  }

  if (user.role === 'admin' && professorId === null) {
    throw new Error('Erro ao buscar professor por userId');
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Workshops', href: '/workshops' },
          {
            label: 'Criar',
            href: `/workshops/create`,
            active: true,
          },
        ]}
      />
      <div className="mx-auto max-w-2xl space-y-8">
        <HeaderBox
          title="Criar Workshop"
          subText="Preencha os campos para criar um novo workshop."
          className="text-3xl"
        />
        <WorkshopForm
          professors={professorOptions || []}
          userRole={user.role}
          professorId={professorId || ''}
        />
      </div>
    </div>
  );
};

export default CreateWorkshopPage;
