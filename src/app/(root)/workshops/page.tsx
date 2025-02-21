import WorkshopPageWrapper from '@/components/root/WorkshopPageWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workshops',
};

const WorkshopsPage = async (props: {
  searchParams?: Promise<WorkshopSearchParams>;
}) => {
  return (
    <WorkshopPageWrapper
      {...props}
      title="Bem-vindo"
      subtitle="Aqui você pode visualizar todos os seus workshops."
      type="all"
      showCreateButton
    />
  );
};

export default WorkshopsPage;
