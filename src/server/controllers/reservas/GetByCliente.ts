import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ReservasProvider } from '../../database/providers/reservas';

export const getReservasCliente = async (
  req: Request,
  res: Response
) => {
  if (req.userRole !== 'CLIENTE') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso negado' },
    });
  }

  const result = await ReservasProvider.getByCliente(req.userId);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.OK).json(result);
};