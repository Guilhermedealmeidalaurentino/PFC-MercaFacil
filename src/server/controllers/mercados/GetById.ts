import { Knex } from '../../database/knex';
import { ETablesNames } from '../../database/ETablesNames';
import { IMercado } from '../../database/models';

export const getById = async (
  id: number
): Promise<IMercado | Error> => {
  try {
    const result = await Knex(ETablesNames.mercado)
      .where('id', '=', id)
      .first();

    if (!result) {
      return new Error('Mercado não encontrado');
    }

    return result;
  } catch (error) {
    console.log(error);
    return new Error('Erro ao buscar mercado');
  }
};