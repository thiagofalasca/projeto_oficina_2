import Breadcrumbs from '@/components/root/Breadcrumbs';
import { AddStudentButton } from '@/components/root/EnrollmentButtons';
import EnrollmentsTable from '@/components/root/EnrollmentsTable';
import Pagination from '@/components/root/Pagination';
import ToastMessage from '@/components/ToastMessage';
import WorkshopDetails from '@/components/root/WorkshopDetails';
import { getCurrentUser } from '@/actions/auth/authActions';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { fetchWorkshopById } from '@/actions/workshop/fetchWorkshopsActions';
import { fetchEnrollmentPages } from '@/actions/enrollment/fetchEnrollmentAction';

export const metadata: Metadata = {
  title: 'Detalhes',
};

const WorkshopInfoPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    deleteError?: string;
    enrolled?: string;
    deleted?: string;
    enrollmentError?: string;
  }>;
}) => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const id = resolvedParams.id;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const deleteError = resolvedSearchParams?.deleteError === 'true';
  const enrolled = resolvedSearchParams?.enrolled === 'true';
  const deleted = resolvedSearchParams?.deleted === 'true';
  const enrollmentError = resolvedSearchParams?.enrollmentError === 'true';

  const workshop = await fetchWorkshopById(id);
  if (!workshop) notFound();

  const enrollmentPages = await fetchEnrollmentPages(id);

  return (
    <div>
      <ToastMessage
        type={deleteError || enrollmentError ? 'error' : 'success'}
        message={
          deleteError
            ? 'Erro ao deletar workshop'
            : enrolled
              ? 'Aluno matriculado com sucesso!'
              : deleted
                ? 'Matrícula deletada com sucesso!'
                : 'Erro ao deletar matrícula'
        }
        show={deleteError || enrolled || deleted || enrollmentError}
      />
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Workshops', href: '/workshops' },
          {
            label: 'Detalhes',
            href: `/workshops/${id}`,
            active: true,
          },
        ]}
      />
      <div className="mx-auto max-w-[1400px] py-8">
        <WorkshopDetails workshop={workshop} user={user} />
        <div className="rounded-lg bg-gray-50 p-6 shadow-lg">
          <div className="mb-4 flex flex-wrap gap-4 md:grid md:grid-cols-3 md:items-center">
            <h2 className="w-full text-2xl font-semibold text-blue-600 md:w-auto">
              Participantes
            </h2>
            <div className="flex flex-1 justify-start md:justify-center">
              <Pagination totalPages={enrollmentPages || 0} />
            </div>
            {user.role !== 'user' && (
              <div className="flex flex-1 justify-end">
                <AddStudentButton workshopId={id} />
              </div>
            )}
          </div>
          <EnrollmentsTable
            workshopId={id}
            page={currentPage}
            userRole={user.role}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkshopInfoPage;
