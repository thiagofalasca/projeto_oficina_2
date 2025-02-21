import HeaderBox from '@/components/HeaderBox';
import Pagination from '@/components/root/Pagination';
import Search from '@/components/root/Search';
import { Suspense } from 'react';
import ToastMessage from '../ToastMessage';
import { CreateWorkshopButton } from './WorkshopButtons';
import { getCurrentUser } from '@/actions/auth/authActions';
import { redirect } from 'next/navigation';
import WorkshopGrid from './WorkshopGrid';
import {
  fetchAvailableWorkshopsPages,
  fetchWorkshopsPages,
} from '@/lib/actions/workshop/fetchWorkshopsActions';

interface WorkshopPageWrapperProps {
  searchParams?: Promise<WorkshopSearchParams>;
  type?: 'all' | 'available';
  title: string;
  subtitle: string;
  showCreateButton?: boolean;
}

const WorkshopPageWrapper = async ({
  searchParams,
  type = 'all',
  title,
  subtitle,
  showCreateButton = false,
}: WorkshopPageWrapperProps) => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  let totalPages = 0;
  if (type === 'all') {
    totalPages = await fetchWorkshopsPages(query);
  } else {
    totalPages = await fetchAvailableWorkshopsPages(query);
  }

  const toastMessage = (() => {
    if (resolvedSearchParams?.created === 'true')
      return 'Workshop criado com sucesso!';
    if (resolvedSearchParams?.updated === 'true')
      return 'Workshop atualizado com sucesso!';
    if (resolvedSearchParams?.deleted === 'true')
      return 'Workshop deletado com sucesso!';
    return '';
  })();

  return (
    <section className="flex flex-col gap-4 md:gap-8">
      {toastMessage && (
        <ToastMessage message={toastMessage} show={!!toastMessage} />
      )}
      <HeaderBox
        title={title}
        subText={subtitle}
        userName={type === 'all' ? user.name : ''}
        className="workshop-header"
      />
      <div className="flex-between gap-2">
        <Search placeholder="Buscar Workshops..." />
        {showCreateButton && user.role !== 'user' && <CreateWorkshopButton />}
      </div>
      <div className="flex-center w-full">
        <Pagination totalPages={totalPages} />
      </div>
      <Suspense>
        <WorkshopGrid query={query} page={currentPage} type={type} />
      </Suspense>
    </section>
  );
};

export default WorkshopPageWrapper;
