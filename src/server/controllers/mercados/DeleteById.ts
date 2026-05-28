import { Knex } from '../../database/knex';
import { ETablesNames } from '../../database/ETablesNames';

export const deleteById = async (
  id: number
): Promise<void | Error> => {
  try {
    const result = await Knex(ETablesNames.mercado)
      .delete()
      .where('id', '=', id);

    if (result > 0) return;
    return new Error('Erro ao deletar mercado');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao deletar mercado');
  }
};