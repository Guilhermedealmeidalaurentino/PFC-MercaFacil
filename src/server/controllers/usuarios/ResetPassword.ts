import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { UsuariosProvider }  from '../../database/providers/usuarios';
import { AuthProvider } from '../../database/providers/auth';
import { PasswordCrypto } from '../../shared/services';

interface IBodyProps {
  senhaAtual: string;
  novaSenha: string;
}
export const resetPasswordValidation =
  validation((getSchema) => ({

    body: getSchema<IBodyProps>(
      yup.object().shape({

        senhaAtual: yup
          .string()
          .required()
          .min(6),

        novaSenha: yup
          .string()
          .required()
          .min(6),
      })
    ),
  }));

export const resetPassword = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {

  const usuarioId = req.userId;

  const {
    senhaAtual,
    novaSenha,
  } = req.body;

  const usuario =
    await AuthProvider.getById(
      usuarioId
    );

  if (usuario instanceof Error) {

    return res.status(
      StatusCodes.NOT_FOUND
    ).json({
      errors: {
        default:
          'Usuário não encontrado',
      },
    });
  }

  const passwordMatch =
    await PasswordCrypto.verifyPassword(
      senhaAtual,
      usuario.senha
    );

  if (!passwordMatch) {

    return res.status(
      StatusCodes.UNAUTHORIZED
    ).json({
      errors: {
        default:
          'Senha atual inválida',
      },
    });
  }

  const result =
    await UsuariosProvider.resetPassword(
      usuarioId,
      novaSenha
    );

  if (result instanceof Error) {

    return res.status(
      StatusCodes.INTERNAL_SERVER_ERROR
    ).json({
      errors: {
        default: result.message,
      },
    });
  }
  return res.status(
    StatusCodes.NO_CONTENT
  ).send();
};