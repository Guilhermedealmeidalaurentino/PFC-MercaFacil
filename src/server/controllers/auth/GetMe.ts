// src/server/controllers/auth/GetMe.ts

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthProvider } from '../../database/providers/auth';
import { MercadosProvider } from '../../database/providers/mercados';

export const getMe = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;

  const result = await AuthProvider.getById(userId);

  if (result instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: result.message },
    });
  }

  let mercado = null;
  if (result.role === 'MERCADO') {
    const mercadoResult = await MercadosProvider.getByUsuarioId(userId);
    if (!(mercadoResult instanceof Error)) {
      mercado = mercadoResult;
    }
  }

  return res.status(StatusCodes.OK).json({
    id: result.id,
    nome: result.nome,
    email: result.email,
    role: result.role,
    aguardando_exclusao: result.aguardando_exclusao ?? false,
    mercado,
  });
};