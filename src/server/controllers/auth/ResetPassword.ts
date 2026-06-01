import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { PasswordResetProvider } from '../../database/providers/auth/PasswordReset';
import { PasswordCrypto } from '../../shared/services';
import { Knex } from '../../database/knex';

interface IBodyProps {
  token: string;
  nova_senha: string;
}

export const resetPasswordValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      token: yup.string().required(),
      nova_senha: yup.string().required().min(6),
    })
  ),
}));

export const resetPassword = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  const { token, nova_senha } = req.body;

  const record = await PasswordResetProvider.findValidToken(token);

  if (!record) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Token inválido ou expirado.' },
    });
  }

  const senhaHash = await PasswordCrypto.hashPassword(nova_senha);

  await Knex('usuario')
    .where({ id: record.usuario_id })
    .update({ senha: senhaHash });

  await PasswordResetProvider.markAsUsed(token);

  return res.status(StatusCodes.OK).json({
    message: 'Senha redefinida com sucesso.',
  });
};