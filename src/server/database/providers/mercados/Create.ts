import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IMercado } from '../../models';

export const create = async (
  mercado: Omit<IMercado, 'id'>
): Promise<number | Error> => {
  try {
    const [result] = await Knex(
      ETablesNames.mercado
    )
      .insert(mercado)
      .returning('id');
    if (typeof result === 'object') {
      return result.id;
    }
    return result;
  } catch (error) {
    console.log(error);
    return new Error(
      'Erro ao criar mercado'
    );
  }
};