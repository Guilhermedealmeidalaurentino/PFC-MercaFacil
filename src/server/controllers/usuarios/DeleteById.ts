import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { UsuariosProvider } from '../../database/providers/usuarios';
interface IParamsProps {
  id?: number;
}
export const deleteByIdValidation =
  validation((getSchema) => ({

    params: getSchema<IParamsProps>(
      yup.object().shape({

        id: yup
          .number()
          .integer()
          .required(),
      })
    ),
  }));
export const deleteById = async (
  req: Request<IParamsProps>,
  res: Response
) => {
  if (!req.params.id) {
    return res.status(
      StatusCodes.BAD_REQUEST
    ).json({
      errors: {
        default: 'Id inválido',
      },
    });
  }
  const result =
    await UsuariosProvider.deleteById(
      req.params.id
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