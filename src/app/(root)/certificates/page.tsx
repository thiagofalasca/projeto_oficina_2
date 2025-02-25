import { CertificateCard } from '@/components/CertificateCard';
import { getCurrentUser } from '@/lib/actions/auth/authActions';
import { fetchCertificates } from '@/lib/actions/certificate/fetchCertificates';
import { redirect } from 'next/navigation';

const CertificatesPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');
  if (user.role !== 'user') redirect('/workshops');

  const certificates = await fetchCertificates();

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-center text-2xl font-bold text-blue-600">
        Meus Certificados
      </h1>
      {certificates.length === 0 && (
        <div className="text-center">Nenhum certificado encontrado</div>
      )}
      <div className="space-y-4">
        {certificates.map((certificate) => (
          <CertificateCard key={certificate.id} certificate={certificate} />
        ))}
      </div>
    </div>
  );
};

export default CertificatesPage;
