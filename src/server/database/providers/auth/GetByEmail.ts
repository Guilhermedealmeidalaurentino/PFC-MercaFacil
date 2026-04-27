import { ETablesNames } from '../../ETablesNames';
import { IUsuario } from '../../models';
import { Knex } from '../../knex';


export const getByEmail = async (email: string): Promise<IUsuario | Error> => {
  try {
    const result = await Knex(ETablesNames.usuario)
      .select('*')
      .where('email', '=', email)
      .first();

    if (result) return result;

    return new Error('Registro não encontrado');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao consultar o registro');
  }
};