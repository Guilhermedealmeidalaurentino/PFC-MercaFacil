// src/server/controllers/mercados/DeleteByIdAdmin.ts

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { MercadosProvider } from '../../database/providers/mercados';
import { LogsProvider } from '../../database/providers/logs';
import { AuthProvider } from '../../database/providers/auth';

interface IParamProps {
  id?: number;
}

export const deleteByIdAdminValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
}));

export const deleteByIdAdmin = async (
  req: Request<IParamProps>,
  res: Response
) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso negado' },
    });
  }

  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'O parâmetro "id" precisa ser informado.' },
    });
  }

  const mercado = await MercadosProvider.getById(Number(req.params.id));
  if (mercado instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Mercado não encontrado' },
    });
  }

  const result = await MercadosProvider.deleteById(Number(req.params.id));
  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  const adminAutor = await AuthProvider.getById(req.userId);
  await LogsProvider.registrar(
    req.userId,
    `... mensagem existente ...`,
    adminAutor instanceof Error ? 'Administrador' : adminAutor.nome,
    adminAutor instanceof Error ? '' : adminAutor.email,
  );

  return res.status(StatusCodes.NO_CONTENT).send();
};