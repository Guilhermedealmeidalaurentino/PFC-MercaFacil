import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';

export const deleteById = async (id: number): Promise<void | Error> => {
  try {
    const result = await Knex(ETablesNames.mercado)
      .where('id', '=', id)
      .del();

    if (result > 0) return;
    return new Error('Erro ao deletar mercado');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao deletar mercado');
  }
};