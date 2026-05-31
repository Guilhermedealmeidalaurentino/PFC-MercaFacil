import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { AuthProvider } from '../../database/providers/auth';
import { Knex } from '../../database/knex';
import { ETablesNames } from '../../database/ETablesNames';
import { LogsProvider } from '../../database/providers/logs';
import { MercadosProvider } from '../../database/providers/mercados';

interface IParamProps {
  id?: number;
}

export const toggleAtivoValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
}));

export const toggleAtivo = async (
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

  const usuario = await AuthProvider.getById(Number(req.params.id));
  if (usuario instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Usuário não encontrado' },
    });
  }

  const novoAtivo = !usuario.ativo;

  await Knex(ETablesNames.usuario)
    .where('id', Number(req.params.id))
    .update({ ativo: novoAtivo });

  const adminAutor = await AuthProvider.getById(req.userId);
  const mercadoVinculado = usuario.role === 'MERCADO'
    ? await MercadosProvider.getByUsuarioId(Number(req.params.id))
    : null;
  const nomeMercado = mercadoVinculado instanceof Error ? null : mercadoVinculado?.nome_mercado ?? null;

  await LogsProvider.registrar(
    req.userId,
    `${novoAtivo ? 'Ativou' : 'Desativou'} o comerciante "${usuario.nome}"`,
    adminAutor instanceof Error ? 'Administrador' : adminAutor.nome,
    adminAutor instanceof Error ? '' : adminAutor.email,
    nomeMercado,
  );

  return res.status(StatusCodes.OK).json({ ativo: novoAtivo });
};