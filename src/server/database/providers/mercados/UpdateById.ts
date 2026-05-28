import { Knex } from '../../knex';
import { ETablesNames } from '../../ETablesNames';
import { IMercado } from '../../models';

export const updateById = async (
  id: number,
  mercado: Partial<Omit<IMercado, 'id' | 'usuario_id'>>
): Promise<void | Error> => {
  try {
    const result = await Knex(
      ETablesNames.mercado
    )
      .update(mercado)
      .where('id', '=', id);

    if (result > 0) return;
    return new Error(
      'Erro ao atualizar mercado'
    );
  } catch (error) {
    console.log(error);
    return new Error(
      'Erro ao atualizar mercado'
    );
  }
};