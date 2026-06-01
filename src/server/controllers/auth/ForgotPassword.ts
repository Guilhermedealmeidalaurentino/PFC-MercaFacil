import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { AuthProvider } from '../../database/providers/auth';
import { PasswordResetProvider } from '../../database/providers/auth/PasswordReset';
import { EmailService } from '../../shared/services';

interface IBodyProps {
  email: string;
}

export const forgotPasswordValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      email: yup.string().required().email(),
    })
  ),
}));

export const forgotPassword = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  const { email } = req.body;

  const usuario = await AuthProvider.getByEmail(email);

  // Responde sempre com sucesso para não revelar se o email existe
  if (usuario instanceof Error) {
    return res.status(StatusCodes.OK).json({
      message: 'Se este email estiver cadastrado, você receberá as instruções em breve.',
    });
  }

  const token = await PasswordResetProvider.createToken(usuario.id);
  await EmailService.sendPasswordResetEmail(usuario.email, usuario.nome, token);

  return res.status(StatusCodes.OK).json({
    message: 'Se este email estiver cadastrado, você receberá as instruções em breve.',
  });
};