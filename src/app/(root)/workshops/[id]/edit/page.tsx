import HeaderBox from '@/components/HeaderBox';
import Breadcrumbs from '@/components/root/Breadcrumbs';
import WorkshopForm from '@/components/root/WorkshopForm';
import { getCurrentRole } from '@/actions/auth/authActions';
import { fetchProfessorOptions } from '@/actions/professorActions';
import { fetchWorkshopById } from '@/actions/workshop/fetchWorkshopsActions';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
  title: 'Editar Workshop',
};

const WorkshopEditPage = async (props: { params: Promise<{ id: string }> }) => {
  const role = await getCurrentRole();
  if (!role) redirect('/api/auth/sign-out');
  if (role === 'user') redirect('/workshops');

  const params = await props.params;
  const id = params.id;

  const [workshop, professorOptions] = await Promise.all([
    fetchWorkshopById(id),
    fetchProfessorOptions(),
  ]);

  if (!workshop) notFound();

  return (
    <div className="h-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Workshops', href: '/workshops' },
          {
            label: 'Detalhes',
            href: `/workshops/${id}`,
          },
          {
            label: 'Editar',
            href: `/workshops/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="mx-auto max-w-2xl space-y-8">
        <HeaderBox
          title="Editar Workshop"
          subText="Preencha os campos para editar o workshop."
          className="text-3xl"
        />
        <WorkshopForm
          professors={professorOptions || []}
          userRole={role}
          workshop={workshop}
          type="edit"
        />
      </div>
    </div>
  );
};

export default WorkshopEditPage;
