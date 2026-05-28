import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IReservaComProdutos } from './GetByCliente';

export const getById = async (
  reserva_id: number,
  user_id: number,
  role: 'CLIENTE' | 'MERCADO' | 'ADMIN'
): Promise<IReservaComProdutos | Error> => {
  try {
    const query = Knex(ETablesNames.reserva)
      .select(
        'reserva.id',
        'reserva.mercado_id',
        'mercado.nome_mercado',
        'reserva.status',
        'reserva.codigo_retirada',
        'reserva.data_reserva',
        'reserva.data_retirada'
      )
      .join(ETablesNames.mercado, 'reserva.mercado_id', 'mercado.id')
      .where('reserva.id', reserva_id)
      .first();

    // Cliente só vê suas próprias reservas
    if (role === 'CLIENTE') {
      query.where('reserva.cliente_id', user_id);
    }

    // Mercado só vê reservas do seu mercado
    if (role === 'MERCADO') {
      query.where('reserva.mercado_id', user_id);
    }

    const reserva = await query;

    if (!reserva) {
      return new Error('Reserva não encontrada');
    }

    const produtos = await Knex(ETablesNames.reserva_produto)
      .select(
        'reserva_produto.produto_id',
        'produto.nome',
        'reserva_produto.quantidade',
        'reserva_produto.preco_unitario'
      )
      .join(ETablesNames.produto, 'reserva_produto.produto_id', 'produto.id')
      .where('reserva_produto.reserva_id', reserva.id);

    return { ...reserva, produtos };
  } catch (error) {
    console.log(error);
    return new Error('Erro ao buscar reserva');
  }
};