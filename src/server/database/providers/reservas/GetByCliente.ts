import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';

export interface IReservaComProdutos {
  id: number;
  mercado_id: number;
  nome_mercado: string;
  status: 'PENDENTE' | 'CONFIRMADA' | 'RETIRADA' | 'CANCELADA';
  codigo_retirada: string;
  data_reserva: Date;
  data_retirada: Date;
  produtos: {
    produto_id: number;
    nome: string;
    quantidade: number;
    preco_unitario: number;
  }[];
}

export const getByCliente = async (
  cliente_id: number
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
        'reserva.data_retirada'
      )
      .join(ETablesNames.mercado, 'reserva.mercado_id', 'mercado.id')
      .where('reserva.cliente_id', cliente_id)
      .orderBy('reserva.data_reserva', 'desc');

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
    return new Error('Erro ao buscar reservas');
  }
};