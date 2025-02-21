import WorkshopPageWrapper from '@/components/root/WorkshopPageWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buscar Workshops',
};

const FindWorkshopsPage = async (props: {
  searchParams?: Promise<WorkshopSearchParams>;
}) => {
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
