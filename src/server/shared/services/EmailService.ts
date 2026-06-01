import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (
  destinatario: string,
  nome: string,
  token: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/redefinir-senha?token=${token}`;

  await resend.emails.send({
    from: 'MercaFacil <onboarding@resend.dev>',
    to: destinatario,
    subject: 'Redefinicao de senha - MercaFacil',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #2e7d32;">MercaFacil</h2>
        <p>Ola, <strong>${nome}</strong>!</p>
        <p>Recebemos uma solicitacao para redefinir a senha da sua conta.</p>
        <p>Clique no botao abaixo para criar uma nova senha. O link e valido por <strong>1 hora</strong>.</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #2e7d32;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 16px 0;
        ">Redefinir senha</a>
        <p style="color: #666; font-size: 13px;">
          Se voce nao solicitou a redefinicao, ignore este email. Sua senha permanece a mesma.
        </p>
        <p style="color: #666; font-size: 12px;">
          Ou copie e cole este link no navegador:<br/>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
      </div>
    `,
  });
};

export const EmailService = { sendPasswordResetEmail };