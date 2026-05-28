import { Knex } from "../../knex"; 
import { ETablesNames } from "../../ETablesNames";
import { IProduto } from "../../models";

export const create = async (
  produto: Omit<IProduto, 'id'>
): Promise<number | Error> => {
  try {
    const [result] = await Knex(ETablesNames.produto)
      .insert(produto)
      .returning('id');

    if (typeof result === 'object' && result.id !== undefined) {
      return result.id;
    }

    if (typeof result === 'number') {
      return result;
    }

    return new Error('Erro ao cadastrar o registro');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao cadastrar o registro');
  }
};