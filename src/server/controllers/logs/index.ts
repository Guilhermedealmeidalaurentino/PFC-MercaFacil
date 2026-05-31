import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LogsProvider } from '../../database/providers/logs';

export const getLogs = async (req: Request, res: Response) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso restrito ao administrador' },
    });
  }

  const result = await LogsProvider.getAll();

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.OK).json(result);
};

export const LogsController = { getLogs };