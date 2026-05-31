// src/server/controllers/mercados/UpdateById.ts

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { MercadosProvider } from '../../database/providers/mercados';
import { LogsProvider } from '../../database/providers/logs';
import { AuthProvider } from '../../database/providers/auth';

interface IParamsProps {
  id?: string;
}

interface IBodyProps {
  nome_mercado?: string;
  horario_abertura?: string;
  horario_fechamento?: string;
}

const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

export const updateByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamsProps>(
    yup.object().shape({
      id: yup.string().required(),
    })
  ),
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome_mercado: yup
        .string()
        .min(3, 'Nome do mercado deve ter ao menos 3 caracteres')
        .optional(),

      horario_abertura: yup
        .string()
        .matches(HORA_REGEX, 'Horário de abertura inválido (use HH:MM)')
        .optional(),

      horario_fechamento: yup
        .string()
        .matches(HORA_REGEX, 'Horário de fechamento inválido (use HH:MM)')
        .optional(),
    })
  ),
}));

export const updateById = async (
  req: Request<IParamsProps, {}, IBodyProps>,
  res: Response
) => {
  if (req.userRole !== 'MERCADO' && req.userRole !== 'ADMIN') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso negado' },
    });
  }

  const mercadoId = Number(req.params.id);

  if (isNaN(mercadoId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'ID de mercado inválido' },
    });
  }

  // Comerciante só pode editar o próprio mercado
  if (req.userRole === 'MERCADO') {
    const mercadoAtual = await MercadosProvider.getByUsuarioId(req.userId);
    if (mercadoAtual instanceof Error || mercadoAtual.id !== mercadoId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        errors: { default: 'Você não tem permissão para editar este mercado' },
      });
    }
  }

  const mercadoAtual = await MercadosProvider.getById(mercadoId);
  if (mercadoAtual instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Mercado não encontrado' },
    });
  }

  const { nome_mercado, horario_abertura, horario_fechamento } = req.body;

  const abertura = horario_abertura ?? mercadoAtual.horario_abertura;
  const fechamento = horario_fechamento ?? mercadoAtual.horario_fechamento;

  const [abH, abM] = abertura.split(':').map(Number);
  const [feH, feM] = fechamento.split(':').map(Number);
  const abMinutos = abH * 60 + abM;
  const feMinutos = feH * 60 + feM;

  if (abMinutos >= feMinutos) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'O horário de abertura deve ser anterior ao horário de fechamento' },
    });
  }

  const dadosParaAtualizar: Partial<{ nome_mercado: string; horario_abertura: string; horario_fechamento: string }> = {};

  if (nome_mercado) dadosParaAtualizar.nome_mercado = nome_mercado;
  if (horario_abertura) dadosParaAtualizar.horario_abertura = horario_abertura;
  if (horario_fechamento) dadosParaAtualizar.horario_fechamento = horario_fechamento;

  if (Object.keys(dadosParaAtualizar).length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Nenhum campo válido enviado para atualização' },
    });
  }

  const result = await MercadosProvider.updateById(mercadoId, dadosParaAtualizar);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  // Log — registra quem editou e o que mudou
  const alteracoes: string[] = [];
  if (nome_mercado) alteracoes.push(`nome: "${mercadoAtual.nome_mercado}" → "${nome_mercado}"`);
  if (horario_abertura) alteracoes.push(`abertura: ${mercadoAtual.horario_abertura} → ${horario_abertura}`);
  if (horario_fechamento) alteracoes.push(`fechamento: ${mercadoAtual.horario_fechamento} → ${horario_fechamento}`);

  const adminAutor = await AuthProvider.getById(req.userId);
  await LogsProvider.registrar(
    req.userId,
    `... mensagem existente ...`,
    adminAutor instanceof Error ? 'Administrador' : adminAutor.nome,
    adminAutor instanceof Error ? '' : adminAutor.email,
  );

  return res.status(StatusCodes.NO_CONTENT).send();
};