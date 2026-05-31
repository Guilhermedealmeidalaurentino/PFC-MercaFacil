// src/server/controllers/usuarios/DeleteById.ts

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { UsuariosProvider } from '../../database/providers/usuarios';
import { AuthProvider } from '../../database/providers/auth';
import { MercadosProvider } from '../../database/providers/mercados';
import { LogsProvider } from '../../database/providers/logs';
import { validation } from '../../shared/middleware';

// ─── Auto-exclusão (usuário exclui a própria conta) ───────────────────────────
export const deleteById = async (req: Request, res: Response) => {
  const usuario = await AuthProvider.getById(req.userId);

  if (!(usuario instanceof Error)) {
    if (usuario.role === 'MERCADO') {
      // Busca o mercado vinculado para incluir o nome no log
      const mercado = await MercadosProvider.getByUsuarioId(req.userId);
      const nomeMercado = mercado instanceof Error ? '' : ` (mercado: "${mercado.nome_mercado}")`;

      const nomeMercadoLog = mercado instanceof Error ? null : mercado.nome_mercado;
      await LogsProvider.registrar(
        req.userId,
        `[MERCADO] Excluiu a própria conta`,
        usuario.nome,
        usuario.email,
        nomeMercadoLog,
      );
    } else {
      await LogsProvider.registrar(
        req.userId,
        `[CLIENTE] Excluiu a própria conta`,
        usuario.nome,
        usuario.email,
      );
    }
  }

  const result = await UsuariosProvider.deleteById(req.userId);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};

// ─── Exclusão por admin ────────────────────────────────────────────────────────
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

  const usuario = await AuthProvider.getById(Number(req.params.id));
  if (usuario instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Usuário não encontrado' },
    });
  }

  const result = await UsuariosProvider.deleteByIdAdmin(Number(req.params.id));
  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  const adminAutor = await AuthProvider.getById(req.userId);
  await LogsProvider.registrar(
    req.userId,
    `Deletou o usuário "${usuario.nome}" (${usuario.email}) de role ${usuario.role}`,
    adminAutor instanceof Error ? 'Administrador' : adminAutor.nome,
    adminAutor instanceof Error ? '' : adminAutor.email,
  );

  return res.status(StatusCodes.NO_CONTENT).send();
};