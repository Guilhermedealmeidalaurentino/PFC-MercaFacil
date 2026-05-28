import 'knex';
import { IMercado, IProduto, IUsuario } from "../../models"

declare module'knex/types/tables'{
  interface Tables{
    produto: IProduto,
    mercado: IMercado,
    usuario: IUsuario,
    //reserva: IReserva,
  }
}