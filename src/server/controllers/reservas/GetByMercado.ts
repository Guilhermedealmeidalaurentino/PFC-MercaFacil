import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ReservasProvider } from '../../database/providers/reservas';
import { MercadosProvider } from '../../database/providers/mercados';

export const getReservasMercado = async (
  req: Request,
  res: Response
) => {
  if (req.userRole !== 'MERCADO') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso negado' },
    });
  }

  const mercado = await MercadosProvider.getByUsuarioId(req.userId);
  if (mercado instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Mercado não encontrado' },
    });
  }

  const result = await ReservasProvider.getByMercado(mercado.id);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.OK).json(result);
};