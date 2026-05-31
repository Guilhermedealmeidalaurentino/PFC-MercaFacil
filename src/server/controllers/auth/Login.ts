// ======================================================
// CONTROLLER - LOGIN
// arquivo: SignIn.ts
// ======================================================

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { AuthProvider } from '../../database/providers/auth';
import { MercadosProvider } from '../../database/providers/mercados';

import { validation } from '../../shared/middleware';

import {
  PasswordCrypto,
  JWTService,
} from '../../shared/services';


interface IBodyProps {
  email: string;
  senha: string;
}

export const signInValidation = validation(
  (getSchema) => ({
    body: getSchema<IBodyProps>(
      yup.object().shape({

        email: yup
          .string()
          .required()
          .email()
          .min(5),

        senha: yup
          .string()
          .required()
          .min(6),
      })
    ),
  })
);


export const signIn = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {

  const { email, senha } = req.body;
  const usuario =
    await AuthProvider.getByEmail(email);

  if (usuario instanceof Error) {
    return res.status(
      StatusCodes.UNAUTHORIZED
    ).json({
      errors: {
        default:
          'Email ou senha inválidos',
      },
    });
  }

  if (usuario.ativo === false) {
    return res.status(
      StatusCodes.UNAUTHORIZED
    ).json({
      errors: {
        default:
          'Usuário desativado',
      },
    });
  }

  const passwordMatch =
    await PasswordCrypto.verifyPassword(
      senha,
      usuario.senha
    );

  if (!passwordMatch) {
    return res.status(
      StatusCodes.UNAUTHORIZED
    ).json({
      errors: {
        default:
          'Email ou senha inválidos',
      },
    });
  }

  const accessToken = JWTService.sign({
    uid: usuario.id,
    role: usuario.role,
  });

  if (
    accessToken ===
    'JWT_SECRET_NOT_FOUND'
  ) {
    return res.status(
      StatusCodes.INTERNAL_SERVER_ERROR
    ).json({
      errors: {
        default:
          'Erro ao gerar token',
      },
    });
  }
  let mercado = null;

  if (usuario.role === 'MERCADO') {

    const mercadoResult = await MercadosProvider.getByUsuarioId(usuario.id);
    if (!(mercadoResult instanceof Error)) {
      mercado = mercadoResult;
    }
  }
  return res.status(StatusCodes.OK).json({
    accessToken,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    },
    mercado,
  });
};