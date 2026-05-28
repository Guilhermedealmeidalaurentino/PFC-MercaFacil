import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IReserva, IReservaProduto } from '../../models';

interface ICreateReservaProps {
  reserva: Omit<IReserva, 'id'>;
  produtos: Omit<IReservaProduto, 'id' | 'reserva_id'>[];
}

export const create = async ({
  reserva,
  produtos,
}: ICreateReservaProps): Promise<{ reserva_id: number; codigo_retirada: string } | Error> => {
  try {
    return await Knex.transaction(async (trx) => {

      for (const item of produtos) {
        const produto = await trx(ETablesNames.produto)
          .where('id', item.produto_id)
          .where('mercado_id', reserva.mercado_id)
          .where('ativo', true)
          .first();
        if (!produto) {
          throw new Error(`Produto ${item.produto_id} não encontrado neste mercado`);
        }
        if (produto.estoque < item.quantidade) {
          throw new Error(`Estoque insuficiente para o produto: ${produto.nome}`);
        }
        await trx(ETablesNames.produto)
          .where('id', item.produto_id)
          .decrement('estoque', item.quantidade);
      }

      const [novaReserva] = await trx(ETablesNames.reserva)
        .insert(reserva)
        .returning(['id', 'codigo_retirada']);

      const reservaProdutos = produtos.map(item => ({
        reserva_id: novaReserva.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
      }));

      await trx(ETablesNames.reserva_produto).insert(reservaProdutos);

      return {
        reserva_id: novaReserva.id,
        codigo_retirada: novaReserva.codigo_retirada,
      };
    });
  } catch (error) {
    console.log(error);
    return error instanceof Error ? error : new Error('Erro ao criar reserva');
  }
};