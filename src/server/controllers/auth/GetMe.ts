
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthProvider } from '../../database/providers/auth';

export const getMe = async (
  req: Request,
  res: Response
) => {

  const userId = req.userId;

  const result = await AuthProvider
    .getById(userId);

  if (result instanceof Error) {
    return res.status(
      StatusCodes.NOT_FOUND
    ).json({
      errors: {
        default: result.message,
      },
    });
  }

  return res.status(StatusCodes.OK).json({
    id: result.id,
    nome: result.nome,
    email: result.email,
    role: result.role,
  });
};