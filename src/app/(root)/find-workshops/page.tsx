import WorkshopPageWrapper from '@/components/root/WorkshopPageWrapper';
import { getCurrentUser } from '@/lib/actions/auth/authActions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Buscar Workshops',
};

const FindWorkshopsPage = async (props: {
  searchParams?: Promise<WorkshopSearchParams>;
}) => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  if (user.role !== 'user') redirect('/workshops');

  return (
    <WorkshopPageWrapper
      {...props}
      title="Lista de Workshops"
      subtitle="Aqui você pode buscar por todos os workshops disponíveis para se inscrever."
      type="available"
      showCreateButton={false}
    />
  );
};

export default FindWorkshopsPage;
