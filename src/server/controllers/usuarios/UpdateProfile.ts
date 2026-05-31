import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { UsuariosProvider } from '../../database/providers/usuarios';

interface IBodyProps {
  nome?: string;
  telefone?: string;
}
export const updateProfileValidation =
  validation((getSchema) => ({
    body: getSchema<IBodyProps>(
      yup.object().shape({

        nome: yup
          .string()
          .optional(),
        telefone: yup
          .string()
          .optional()
          .test(
            'telefone-valido',
            'Telefone inválido — informe um número com DDD (10 ou 11 dígitos)',
            (value) => {
              if (!value) return true;
              const limpo = value.replace(/\D/g, '');
              return limpo.length === 10 || limpo.length === 11;
            }
          ),
      })
    ),
  }));

export const updateProfile = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  const usuarioId = req.userId;
  const result =
    await UsuariosProvider.updateProfile(
      usuarioId,
      req.body
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