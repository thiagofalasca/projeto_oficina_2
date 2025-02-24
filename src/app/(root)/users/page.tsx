import HeaderBox from '@/components/HeaderBox';
import Pagination from '@/components/root/Pagination';
import Search from '@/components/root/Search';
import { CreateUserButton } from '@/components/root/UsersButtons';
import UsersTable from '@/components/root/UsersTable';
import ToastMessage from '@/components/ToastMessage';
import { getCurrentUser } from '@/lib/actions/auth/authActions';
import { fetchUsersPages } from '@/lib/actions/user/fetchUserActions';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

const UsersPage = async (props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    created?: string;
    cannotDeleteYourselfError?: string;
    professorHasWorkshopsError?: string;
    userHasEnrollments?: string;
    deleteError?: string;
  }>;
}) => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchUsersPages(query);

  const toastMessages: Record<string, { type: 'success' | 'error'; message: string }> = {
    created: { type: 'success', message: 'Usuário criado com sucesso!' },
    updated: { type: 'success', message: 'Usuário alterado com sucesso!' },
    cannotDeleteYourselfError: { type: 'error', message: 'Você não pode deletar a si mesmo!' },
    professorHasWorkshopsError: { type: 'error', message: 'Não é possível deletar um professor que contém workshops' },
    userHasEnrollments: { type: 'error', message: 'Usuário está inscrito em workshops e não pode ser deletado' },
    deleteError: { type: 'error', message: 'Erro ao deletar usuário' },
  };

  const searchParamsObject = searchParams as Record<string, string | undefined>;

  const activeMessage = Object.entries(toastMessages).find(
    ([key]) => searchParamsObject[key] === 'true'
  );

  return (
    <section className="flex flex-col gap-4 md:gap-8">
      {activeMessage && (
        <ToastMessage
          type={activeMessage[1].type}
          message={activeMessage[1].message}
          show={true}
        />
      )}
      <HeaderBox
        title={'Gestão de Usuários'}
        subText={'Aqui você pode gerênciar todos os usuários do sistema.'}
        className="workshop-header"
      />
      <div className="flex-between gap-2">
        <Search placeholder="Buscar Usuários..." />
        <CreateUserButton />
      </div>
      <div className="flex-center w-full">
        <Pagination totalPages={totalPages} />
      </div>
      <div className="rounded-lg bg-gray-50 p-6 shadow-lg">
        <Suspense>
          <UsersTable query={query} page={currentPage} userRole={user.role} />
        </Suspense>
      </div>
    </section>
  );
};

export default UsersPage;
