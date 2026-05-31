import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ReportsProvider } from '../../database/providers/reports';

export const getAll = async (req: Request, res: Response) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso restrito ao administrador' },
    });
  }

  const result = await ReportsProvider.getAll();

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.OK).json(result);
};

export const marcarVisualizado = async (req: Request<{ id?: number }>, res: Response) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso restrito ao administrador' },
    });
  }

  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'O parâmetro "id" precisa ser informado.' },
    });
  }

  const result = await ReportsProvider.marcarVisualizado(Number(req.params.id));

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};

export const countNaoVisualizados = async (req: Request, res: Response) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso restrito ao administrador' },
    });
  }

  const result = await ReportsProvider.countNaoVisualizados();

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.OK).json({ total: result });
};

export const ReportsController = { getAll, marcarVisualizado, countNaoVisualizados };