import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import * as bcrypt from 'bcryptjs';
import { Knex } from '../../database/knex';
import { ETablesNames } from '../../database/ETablesNames';
import { UsuariosProvider } from '../../database/providers/usuarios';
import { AuthProvider } from '../../database/providers/auth';
import { MercadosProvider } from '../../database/providers/mercados';
import { LogsProvider } from '../../database/providers/logs';
import { EmailService } from '../../shared/services';
import { validation } from '../../shared/middleware';

// ─── Auto-exclusão ────────────────────────────────────────────────────────────
export const deleteById = async (req: Request, res: Response) => {
  const usuario = await AuthProvider.getById(req.userId);

  if (usuario instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Usuário não encontrado' },
    });
  }

  // ── Validação de senha ────────────────────────────────────────────────────
  const { senha } = req.body as unknown as { senha: string };

  if (!senha) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Informe sua senha para confirmar a exclusão.' },
    });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: 'Senha incorreta. Tente novamente.' },
    });
  }

  // ── CLIENTE: cancela reservas ativas, notifica mercados e deleta ───────────
  if (usuario.role === 'CLIENTE') {
    const reservasAtivas = await Knex(ETablesNames.reserva)
      .where('cliente_id', req.userId)
      .whereIn('status', ['PENDENTE', 'CONFIRMADA']);

    for (const reserva of reservasAtivas) {
      await Knex.transaction(async (trx) => {
        const itens = await trx(ETablesNames.reserva_produto)
          .where('reserva_id', reserva.id);

        for (const item of itens) {
          await trx(ETablesNames.produto)
            .where('id', item.produto_id)
            .increment('estoque', item.quantidade);
        }

        await trx(ETablesNames.reserva)
          .where('id', reserva.id)
          .update({
            status: 'CANCELADA',
            motivo_cancelamento: 'Cliente encerrou a conta na plataforma',
          });
      });

      try {
        const mercado = await MercadosProvider.getById(reserva.mercado_id);
        if (!(mercado instanceof Error)) {
          const usuarioMercado = await AuthProvider.getById(mercado.usuario_id);
          if (!(usuarioMercado instanceof Error)) {
            await EmailService.sendReservaCanceladaPorExclusaoEmail(
              usuarioMercado.email,
              mercado.nome_mercado,
              reserva.id,
              reserva.codigo_retirada,
              reserva.data_retirada,
            );
          }
        }
      } catch (emailError) {
        console.error(`Falha ao enviar email para mercado da reserva #${reserva.id}:`, emailError);
      }
    }

    await LogsProvider.registrar(
      req.userId,
      `[CLIENTE] Excluiu a própria conta`,
      usuario.nome,
      usuario.email,
    );

    const result = await UsuariosProvider.deleteById(req.userId);
    if (result instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: { default: result.message },
      });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
  }

  // ── MERCADO: exclusão suave com cancelamento automático de pendentes ────────
  if (usuario.role === 'MERCADO') {
    if (usuario.aguardando_exclusao) {
      return res.status(StatusCodes.CONFLICT).json({
        errors: { default: 'Sua conta já está aguardando exclusão.' },
      });
    }

    const mercado = await MercadosProvider.getByUsuarioId(req.userId);
    if (mercado instanceof Error) {
      return res.status(StatusCodes.NOT_FOUND).json({
        errors: { default: 'Mercado não encontrado' },
      });
    }

    // ── Cancela automaticamente todas as reservas PENDENTES ──────────────────
    const reservasPendentes = await Knex(ETablesNames.reserva)
      .where('mercado_id', mercado.id)
      .where('status', 'PENDENTE');

    for (const reserva of reservasPendentes) {
      await Knex.transaction(async (trx) => {
        const itens = await trx(ETablesNames.reserva_produto)
          .where('reserva_id', reserva.id);

        for (const item of itens) {
          await trx(ETablesNames.produto)
            .where('id', item.produto_id)
            .increment('estoque', item.quantidade);
        }

        await trx(ETablesNames.reserva)
          .where('id', reserva.id)
          .update({
            status: 'CANCELADA',
            motivo_cancelamento: 'Mercado encerrou a conta na plataforma',
          });
      });
    }

    // ── Verifica se ainda restam reservas CONFIRMADAS ─────────────────────────
    const confirmadas = await Knex(ETablesNames.reserva)
      .where('mercado_id', mercado.id)
      .where('status', 'CONFIRMADA')
      .count('id as total')
      .first();

    const totalConfirmadas = Number(confirmadas?.total ?? 0);

    // ── Marca como aguardando exclusão e desativa o mercado ───────────────────
    await Knex(ETablesNames.usuario)
      .where('id', req.userId)
      .update({ aguardando_exclusao: true });

    await Knex(ETablesNames.mercado)
      .where('id', mercado.id)
      .update({ ativo: false });

    await LogsProvider.registrar(
      req.userId,
      `[MERCADO] Solicitou exclusão da própria conta — ${totalConfirmadas} reserva(s) confirmada(s) pendente(s)`,
      usuario.nome,
      usuario.email,
      mercado.nome_mercado,
    );

    // ── Se não há confirmadas, exclui imediatamente ───────────────────────────
    if (totalConfirmadas === 0) {
      await Knex(ETablesNames.usuario)
        .where('id', req.userId)
        .delete();

      return res.status(StatusCodes.OK).json({
        message: 'Conta excluída com sucesso.',
        contaExcluida: true,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: `Conta em processo de exclusão. Você ainda tem ${totalConfirmadas} reserva(s) confirmada(s) para resolver.`,
    });
  }

  return res.status(StatusCodes.FORBIDDEN).json({
    errors: { default: 'Ação não permitida para este perfil.' },
  });
};

// ─── Cancela o pedido de exclusão (comerciante desiste) ───────────────────────
export const cancelarExclusao = async (req: Request, res: Response) => {
  const usuario = await AuthProvider.getById(req.userId);

  if (usuario instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Usuário não encontrado' },
    });
  }

  if (usuario.role !== 'MERCADO') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Ação não permitida para este perfil.' },
    });
  }

  if (!usuario.aguardando_exclusao) {
    return res.status(StatusCodes.CONFLICT).json({
      errors: { default: 'Sua conta não está em processo de exclusão.' },
    });
  }

  const mercado = await MercadosProvider.getByUsuarioId(req.userId);
  if (mercado instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Mercado não encontrado' },
    });
  }

  await Knex(ETablesNames.usuario)
    .where('id', req.userId)
    .update({ aguardando_exclusao: false });

  await Knex(ETablesNames.mercado)
    .where('id', mercado.id)
    .update({ ativo: true });

  await LogsProvider.registrar(
    req.userId,
    `[MERCADO] Cancelou o pedido de exclusão da conta`,
    usuario.nome,
    usuario.email,
    mercado.nome_mercado,
  );

  return res.status(StatusCodes.OK).json({
    message: 'Pedido de exclusão cancelado. Sua conta e mercado estão ativos novamente.',
  });
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

  const result = await UsuariosProvider.deleteByIdAdmin(Number(req.params.id));

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message },
    });
  }

  const adminAutor = await AuthProvider.getById(req.userId);
  await LogsProvider.registrar(
    req.userId,
    `[ADMIN] Deletou o usuário #${req.params.id}`,
    adminAutor instanceof Error ? 'Administrador' : adminAutor.nome,
    adminAutor instanceof Error ? '' : adminAutor.email,
  );

  return res.status(StatusCodes.NO_CONTENT).send();
};