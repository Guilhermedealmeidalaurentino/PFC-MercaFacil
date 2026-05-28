import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IMercado } from '../../models';

export const getById = async (
  id: number
): Promise<IMercado | Error> => {
  try {
    const result = await Knex(ETablesNames.mercado)
      .select('*')
      .where('id', '=', id)
      .first();

    if (result) return result;
    return new Error('Mercado não encontrado');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao buscar mercado');
  }
};