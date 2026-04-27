import { ETablesNames } from '../../ETablesNames';
import { IProduto } from '../../models';
import { Knex } from '../../knex';


export const updateById = async (id: number, produto: Omit<IProduto, 'id'>): Promise<void | Error> => {
  try {
    const result = await Knex(ETablesNames.produto)
      .update(produto)
      .where('id', '=', id);

    if (result > 0) return;

    return new Error('Erro ao atualizar o registro');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao atualizar o registro');
  }
};