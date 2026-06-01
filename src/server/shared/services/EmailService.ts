import nodemailer from 'nodemailer';

const createTransporter = async () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
};

const sendPasswordResetEmail = async (
  destinatario: string,
  nome: string,
  token: string
): Promise<void> => {
  const transporter = await createTransporter();

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/redefinir-senha?token=${token}`;

  const info = await transporter.sendMail({
    from: '"MercaFacil" <noreply@mercafacil.com>',
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

  if (process.env.NODE_ENV !== 'production') {
    console.log('Preview do email: %s', nodemailer.getTestMessageUrl(info));
  }
};

export const EmailService = { sendPasswordResetEmail };