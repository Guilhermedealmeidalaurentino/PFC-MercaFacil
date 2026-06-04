// src/server/database/providers/reservas/UpdateStatus.ts

import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IReserva } from '../../models';

export const updateStatus = async (
  reserva_id: number,
  mercado_id: number,
  status: IReserva['status'],
  motivo_cancelamento?: string,
): Promise<{ contaExcluida: boolean } | Error> => {
  try {
    const reserva = await Knex(ETablesNames.reserva)
      .where('id', reserva_id)
      .where('mercado_id', mercado_id)
      .first();

    if (!reserva) {
      return new Error('Reserva não encontrada');
    }

    const fluxoValido: Record<IReserva['status'], IReserva['status'][]> = {
      PENDENTE:   ['CONFIRMADA', 'CANCELADA'],
      CONFIRMADA: ['RETIRADA',   'CANCELADA'],
      RETIRADA:   [],
      CANCELADA:  [],
    };

    const statusAtual = reserva.status as IReserva['status'];

    if (!fluxoValido[statusAtual].includes(status)) {
      return new Error(
        `Não é possível alterar status de ${statusAtual} para ${status}`
      );
    }

    if (status === 'CANCELADA') {
      const itens = await Knex(ETablesNames.reserva_produto)
        .where('reserva_id', reserva_id);

      for (const item of itens) {
        await Knex(ETablesNames.produto)
          .where('id', item.produto_id)
          .increment('estoque', item.quantidade);
      }

      if (motivo_cancelamento) {
        await Knex(ETablesNames.report_nao_retirada).insert({
          reserva_id,
          mercado_id,
          cliente_id: reserva.cliente_id,
          motivo: motivo_cancelamento,
          visualizado: false,
        });
      }
    }

    await Knex(ETablesNames.reserva)
      .where('id', reserva_id)
      .update({
        status,
        ...(motivo_cancelamento ? { motivo_cancelamento } : {}),
      });

    // ── Auto-exclusão: se o mercado estava aguardando exclusão e acabou de
    //    resolver sua última reserva ativa, deleta a conta automaticamente ────
    if (status === 'RETIRADA' || status === 'CANCELADA') {
    const mercado = await Knex(ETablesNames.mercado)
      .where('id', mercado_id)
      .first();

    if (mercado) {
      const usuario = await Knex(ETablesNames.usuario)
        .where('id', mercado.usuario_id)
        .first();

      if (usuario?.aguardando_exclusao) {
        const pendentes = await Knex(ETablesNames.reserva)
          .where('mercado_id', mercado_id)
          .whereIn('status', ['PENDENTE', 'CONFIRMADA'])
          .count('id as total')
          .first();

        const total = Number(pendentes?.total ?? 0);

        if (total === 0) {
          await Knex(ETablesNames.usuario)
            .where('id', mercado.usuario_id)
            .delete();

          return { contaExcluida: true };  // ← sinaliza ao controller
        }
      }
    }
  }

  return { contaExcluida: false };

  } catch (error) {
    console.log(error);
    return new Error('Erro ao atualizar status da reserva');
  }
};