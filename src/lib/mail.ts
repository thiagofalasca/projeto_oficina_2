import 'server-only';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailResult {
  success: boolean;
}

const generateEmailHtml = (
  title: string,
  greeting: string,
  message: string,
  buttonText: string,
  link: string
) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px;">
        <tr>
            <td style="padding: 20px;">
                <h1 style="color: #4a4a4a; text-align: center;">${title}</h1>
                <p style="margin-bottom: 20px;">${greeting}</p>
                <p>${message}</p>
                <p style="text-align: center;">
                    <a href="${link}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">${buttonText}</a>
                </p>
                <p>Se o botão não funcionar, você também pode copiar e colar o seguinte link no seu navegador:</p>
                <p style="word-break: break-all;">${link}</p>
                <p>Este link irá expirar em 1 hora por motivos de segurança.</p>
                <p style="margin-top: 20px;">Atenciosamente,<br>UTFPR Team</p>
            </td>
        </tr>
    </table>
</div>
`;

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<EmailResult> => {
  try {
    const resetLink = `${process.env.PROJECT_URL}/auth/reset/new-password?token=${token}`;
    const htmlContent = generateEmailHtml(
      'Redefinição de Senha',
      'Olá,',
      'Recebemos uma solicitação para redefinir sua senha. Se você não fez essa solicitação, pode ignorar este e-mail. Para redefinir sua senha, clique no botão abaixo:',
      'Redefinir Senha',
      resetLink
    );
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Altere sua senha',
      html: htmlContent,
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email de redefinição de senha: ' + error);
    return { success: false };
  }
};

export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<EmailResult> => {
  try {
    const confirmLink = `${process.env.PROJECT_URL}/auth/email-confirmation?token=${token}`;
    const htmlContent = generateEmailHtml(
      'Confirme sua Conta',
      'Bem-Vindo!',
      '<p>Obrigado por criar uma conta conosco. Para concluir seu registro e ativar sua conta, clique no botão abaixo:</p>',
      'Confirmar Conta',
      confirmLink
    );
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: 'Confirme seu email',
      html: htmlContent,
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email de confirmação de conta: ' + error);
    return { success: false };
  }
};
