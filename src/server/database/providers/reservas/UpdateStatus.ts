import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IReserva } from '../../models';

export const updateStatus = async (
  reserva_id: number,
  mercado_id: number,
  status: IReserva['status']
): Promise<void | Error> => {
  try {
    const reserva = await Knex(ETablesNames.reserva)
      .where('id', reserva_id)
      .where('mercado_id', mercado_id)
      .first();

    if (!reserva) {
      return new Error('Reserva não encontrada');
    }

    const fluxoValido: Record<IReserva['status'], IReserva['status'][]> = {
      PENDENTE: ['CONFIRMADA', 'CANCELADA'],
      CONFIRMADA: ['RETIRADA', 'CANCELADA'],
      RETIRADA: [],
      CANCELADA: [],
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
    }

    await Knex(ETablesNames.reserva)
      .where('id', reserva_id)
      .update({ status });

  } catch (error) {
    console.log(error);
    return new Error('Erro ao atualizar status da reserva');
  }
};