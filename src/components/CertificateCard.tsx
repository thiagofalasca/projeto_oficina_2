'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { downloadCertificate } from '@/lib/actions/certificate/downloadCertificate';
import { formatDate } from '@/lib/utils';
import { CalendarIcon, DownloadIcon, UserIcon } from 'lucide-react';

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const handleDownload = async () => {
    try {
      const base64Pdf = await downloadCertificate(certificate);

      const binaryString = window.atob(base64Pdf);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar certificado:', error);
      throw new Error('Erro ao baixar certificado');
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <h2 className="font-semibold text-blue-600">
            {certificate.workshopName}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>{formatDate(certificate.issuedDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon className="h-4 w-4" />
            <span>Professor responsável: {certificate.signedBy.name}</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleDownload}
          title="Baixar certificado"
        >
          <DownloadIcon className="h-4 w-4" />
          <span className="sr-only">Baixar certificado</span>
        </Button>
      </CardContent>
    </Card>
  );
}
