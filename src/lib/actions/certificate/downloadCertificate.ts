'use server';

import { PDFDocument, StandardFonts } from 'pdf-lib';
import { getCurrentUser } from '../auth/authActions';
import path from 'path';
import { readFile } from 'fs/promises';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { workshopEnrollments, students, users, professors } from '@/db/schema';
import { formatDate } from '@/lib/utils';

export async function downloadCertificate(certificate: Certificate) {
  const user = await getCurrentUser();
  if (!user) redirect('/api/auth/sign-out');

  const enrollmentData = await db
    .select({ studentName: users.name })
    .from(workshopEnrollments)
    .innerJoin(students, eq(workshopEnrollments.studentId, students.id))
    .innerJoin(users, eq(students.userId, users.id))
    .where(eq(workshopEnrollments.id, certificate.enrollmentId))
    .then((res) => res[0]);

  const professorData = await db
    .select({ name: users.name })
    .from(professors)
    .innerJoin(users, eq(professors.userId, users.id))
    .where(eq(users.id, certificate.signedBy.id))
    .then((res) => res[0]);

  const templatePath = "/var/task/templates/certificateModel.pdf";

  const templateBytes = await readFile(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);

  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const studentName = enrollmentData ? enrollmentData.studentName : 'Aluno';
  const textContent = `Certificamos que ${studentName} participou e concluiu com êxito o workshop "${certificate.workshopName}", realizado no período de ${formatDate(certificate.startDate)} a ${formatDate(certificate.endDate)}.
Este certificado é concedido em reconhecimento ao seu comprometimento e dedicação.`;

  page.drawText(certificate.certificateNumber, {
    x: 320,
    y: 580,
    font,
    size: 10,
    opacity: 0.5,
  });
  page.drawText(textContent, {
    x: 120,
    y: 300,
    font,
    size: 18,
    maxWidth: 700,
    lineHeight: 20,
  });
  page.drawText(professorData.name, {
    x: 250,
    y: 108,
    font,
    size: 14,
  });
  page.drawText(studentName, {
    x: 505,
    y: 108,
    font,
    size: 14,
  });

  const pdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(pdfBytes).toString('base64');
  return base64Pdf;
}
