import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middleware';
import { ReservasProvider } from '../../database/providers/reservas';
import { MercadosProvider } from '../../database/providers/mercados';
import { ProdutosProvider } from '../../database/providers/produtos';
import { ReservaCodeService } from '../../shared/services';

interface IProdutoReserva {
  produto_id: number;
  quantidade: number;
}

interface IBodyProps {
  mercado_id: number;
  data_retirada: string; // ← cliente informa
  produtos: IProdutoReserva[];
}

export const createReservaValidation = validation(
  (getSchema) => ({
    body: getSchema<IBodyProps>(
      yup.object().shape({
        mercado_id: yup.number().required(),
        data_retirada: yup.string().required(),
        produtos: yup.array().of(
          yup.object().shape({
            produto_id: yup.number().required(),
            quantidade: yup.number().required().min(1),
          })
        ).required().min(1),
      })
    ),
  })
);

export const createReserva = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  if (req.userRole !== 'CLIENTE') {
    return res.status(StatusCodes.FORBIDDEN).json({
      errors: { default: 'Apenas clientes podem fazer reservas' },
    });
  }

  const { mercado_id, data_retirada, produtos } = req.body;

  const mercado = await MercadosProvider.getById(mercado_id);
  if (mercado instanceof Error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      errors: { default: 'Mercado não encontrado' },
    });
  }

  // Valida a data escolhida pelo cliente
  const dataValidada = ReservaCodeService.validarDataRetirada(
    data_retirada,
    mercado.horario_abertura,
    mercado.horario_fechamento,
  );

  if (dataValidada instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: dataValidada.message },
    });
  }

  const produtosComPreco = await Promise.all(
    produtos.map(async (item) => {
      const produto = await ProdutosProvider.getById(item.produto_id);
      if (produto instanceof Error) throw new Error(`Produto ${item.produto_id} não encontrado`);
      return {
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: produto.preco,
      };
    })
  );

  const codigo_retirada = ReservaCodeService.gerar();

  const result = await ReservasProvider.create({
    reserva: {
      cliente_id: req.userId,
      mercado_id,
      status: 'PENDENTE',
      codigo_retirada,
      data_retirada: dataValidada,
    },
    produtos: produtosComPreco,
  });

  if (result instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: { default: result.message },
    });
  }

  return res.status(StatusCodes.CREATED).json({
    reserva_id: result.reserva_id,
    codigo_retirada: result.codigo_retirada,
    data_retirada: dataValidada,
  });
};