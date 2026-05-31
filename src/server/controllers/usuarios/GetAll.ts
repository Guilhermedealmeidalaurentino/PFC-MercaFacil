import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { UsuariosProvider } from '../../database/providers/usuarios';

interface IQueryProps {
  page?: number;
  limit?: number;
  filter?: string;
}
export const getAllValidation =
  validation((getSchema) => ({

    query: getSchema<IQueryProps>(
      yup.object().shape({

        page: yup
          .number()
          .integer()
          .min(1)
          .optional(),

        limit: yup
          .number()
          .integer()
          .min(1)
          .max(200)
          .optional(),

        filter: yup
          .string()
          .optional(),
      })
    ),
  }));
export const getAll = async (
  req: Request<
    {},
    {},
    {},
    IQueryProps
  >,
  res: Response
) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const filter = req.query.filter || '';
  const result =
    await UsuariosProvider.getAll(
      page,
      limit,
      filter
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
    StatusCodes.OK
  ).json(result);
};