import { IProduto } from "../../models"

declare module'knex/types/tables'{
  interface Tables{
    produto: IProduto
    //cliente: ICliente
    //comerciante: IComerciante
    //usuario: IUsuario
  }
}