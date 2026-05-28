import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UsuariosProvider } from '../../database/providers/usuarios';

export const getById = async (
  req: Request,
  res: Response
) => {
  const usuarioId = req.userId;

  const result = await UsuariosProvider.getById(usuarioId);

  if (result instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.OK).json(result);
};