'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-center h-full flex-col">
      <h2 className="text-center">Ops, algo deu errado!</h2>
      <button
        className="base-btn mt-4 bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => reset()}
      >
        Tentar novamente
      </button>
    </main>
  );
}
