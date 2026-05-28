import { Knex } from '../../database/knex';
import { ETablesNames } from '../../database/ETablesNames';
import { IMercado } from '../../database/models';

export const updateById = async (
  id: number,
  mercado: Partial<IMercado>
): Promise<void | Error> => {
  try {
    const result = await Knex(ETablesNames.mercado)
      .update(mercado)
      .where('id', '=', id);

    if (result > 0) return;
    return new Error('Erro ao atualizar mercado');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao atualizar mercado');
  }
};