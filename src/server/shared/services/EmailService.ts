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

// ─── Notifica o mercado que uma reserva foi cancelada por exclusão de conta ───
const sendReservaCanceladaPorExclusaoEmail = async (
  emailMercado: string,
  nomeMercado: string,
  reservaId: number,
  codigoRetirada: string,
  dataRetirada: string,
): Promise<void> => {
  const dataFormatada = new Date(dataRetirada).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  await resend.emails.send({
    from: 'MercaFacil <onboarding@resend.dev>',
    to: emailMercado,
    subject: `Reserva #${reservaId} cancelada - Cliente encerrou a conta`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #2e7d32;">MercaFacil</h2>
        <p>Ola, <strong>${nomeMercado}</strong>!</p>
        <p>
          Informamos que a reserva abaixo foi <strong>cancelada automaticamente</strong>
          porque o cliente encerrou sua conta na plataforma.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Reserva</td>
            <td style="padding: 10px; border: 1px solid #ddd;">#${reservaId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Codigo de retirada</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${codigoRetirada}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Data de retirada prevista</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${dataFormatada}</td>
          </tr>
        </table>
        <p style="color: #666; font-size: 13px;">
          O estoque dos produtos reservados ja foi restituido automaticamente.
          Nenhuma acao e necessaria da sua parte.
        </p>
        <p style="color: #666; font-size: 12px;">
          Em caso de duvidas, entre em contato com o suporte da plataforma.
        </p>
      </div>
    `,
  });
};

export const EmailService = {
  sendPasswordResetEmail,
  sendReservaCanceladaPorExclusaoEmail,
};