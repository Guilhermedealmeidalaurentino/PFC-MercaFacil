import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';

export const cancelarByCliente = async (
  reserva_id: number,
  cliente_id: number
): Promise<void | Error> => {
  try {
    const reserva = await Knex(ETablesNames.reserva)
      .where('id', reserva_id)
      .where('cliente_id', cliente_id)
      .first();

    if (!reserva) {
      return new Error('Reserva não encontrada');
    }

    if (reserva.status !== 'PENDENTE') {
      return new Error('Só é possível cancelar reservas com status PENDENTE');
    }

    return await Knex.transaction(async (trx) => {
      const itens = await trx(ETablesNames.reserva_produto)
        .where('reserva_id', reserva_id);

      for (const item of itens) {
        await trx(ETablesNames.produto)
          .where('id', item.produto_id)
          .increment('estoque', item.quantidade);
      }

      await trx(ETablesNames.reserva)
        .where('id', reserva_id)
        .update({ status: 'CANCELADA' });
    });

  } catch (error) {
    console.log(error);
    return new Error('Erro ao cancelar reserva');
  }
};