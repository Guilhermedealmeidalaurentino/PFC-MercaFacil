// src/server/controllers/mercados/ToggleAtivoMercado.ts

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { MercadosProvider } from '../../database/providers/mercados';
import { LogsProvider } from '../../database/providers/logs';
import { Knex } from '../../database/knex';
import { ETablesNames } from '../../database/ETablesNames';
import { AuthProvider } from '../../database/providers/auth';

interface IParamProps {
  id?: number;
}

export const toggleAtivoMercadoValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
}));

export const toggleAtivoMercado = async (
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

  const novoAtivo = !mercado.ativo;

  await Knex(ETablesNames.mercado)
    .where('id', Number(req.params.id))
    .update({ ativo: novoAtivo });
    
  const adminAutor = await AuthProvider.getById(req.userId);
  await LogsProvider.registrar(
    req.userId,
    `[MERCADO] ${novoAtivo ? 'Ativou' : 'Desativou'} o mercado "${mercado.nome_mercado}" (ID: ${mercado.id})`,
    adminAutor instanceof Error ? 'Administrador' : adminAutor.nome,
    adminAutor instanceof Error ? '' : adminAutor.email,
  );

  return res.status(StatusCodes.OK).json({ ativo: novoAtivo });
};