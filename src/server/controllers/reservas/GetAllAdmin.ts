import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Knex } from '../../database/knex';
import { ETablesNames } from '../../database/ETablesNames';

export const getAllAdmin = async (req: Request, res: Response) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Acesso negado' },
    });
  }

  try {
    const reservas = await Knex(ETablesNames.reserva)
      .select(
        'reserva.id',
        'reserva.mercado_id',
        'mercado.nome_mercado',
        'reserva.cliente_id',
        'usuario.nome as nome_cliente',
        'usuario.email as email_cliente',
        'reserva.status',
        'reserva.codigo_retirada',
        'reserva.data_reserva',
        'reserva.data_retirada',
        'reserva.motivo_cancelamento',
      )
      .join(ETablesNames.mercado, 'reserva.mercado_id', 'mercado.id')
      .join(ETablesNames.usuario, 'reserva.cliente_id', 'usuario.id')
      .orderBy('reserva.data_reserva', 'desc');

    const reservasComProdutos = await Promise.all(
      reservas.map(async (reserva) => {
        const produtos = await Knex(ETablesNames.reserva_produto)
          .select(
            'reserva_produto.produto_id',
            'produto.nome',
            'reserva_produto.quantidade',
            'reserva_produto.preco_unitario',
          )
          .join(ETablesNames.produto, 'reserva_produto.produto_id', 'produto.id')
          .where('reserva_produto.reserva_id', reserva.id);

        return { ...reserva, produtos };
      })
    );

    return res.status(StatusCodes.OK).json(reservasComProdutos);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: 'Erro ao buscar reservas' },
    });
  }
};