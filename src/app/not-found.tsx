import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <section className="flex-center h-screen w-full flex-col gap-2 font-inter">
      <FaceFrownIcon className="w-10 text-gray-500" />
      <h2 className="text-xl font-semibold">404 Página não encontrada</h2>
      <p>O link acessado não existe.</p>
      <Link
        href="/workshops"
        className="base-btn mt-4 bg-blue-600 text-white hover:bg-blue-700"
      >
        Voltar
      </Link>
    </section>
  );
}
