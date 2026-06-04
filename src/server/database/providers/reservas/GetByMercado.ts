import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IReservaComProdutos } from './GetByCliente';

export const getByMercado = async (
  mercado_id: number
): Promise<IReservaComProdutos[] | Error> => {
  try {
    const reservas = await Knex(ETablesNames.reserva)
      .select(
        'reserva.id',
        'reserva.mercado_id',
        'mercado.nome_mercado',
        'reserva.status',
        'reserva.codigo_retirada',
        'reserva.data_reserva',
        'reserva.data_retirada',
        'usuario.nome as nome_cliente'
      )
      .join(ETablesNames.mercado, 'reserva.mercado_id', 'mercado.id')
      .join(ETablesNames.usuario, 'reserva.cliente_id', 'usuario.id')
      .where('reserva.mercado_id', mercado_id)
      .orderBy('reserva.data_retirada', 'asc');

    const reservasComProdutos = await Promise.all(
      reservas.map(async (reserva) => {
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
      })
    );

    return reservasComProdutos;
  } catch (error) {
    console.log(error);
    return new Error('Erro ao buscar reservas do mercado');
  }
};