import EmailConfirmation from '@/components/auth/EmailConfirmation';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Confirmação de Email',
};

export default function EmailConfirmationPage() {
  return (
    <Suspense>
      <EmailConfirmation />
    </Suspense>
  );
}
