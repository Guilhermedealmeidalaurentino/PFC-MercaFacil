import knex from "knex";
import { ETablesNames } from "../../ETablesNames";
import { IProduto } from "../../models";

export const create = async (
  produto: Omit<IProduto, 'id'>
): Promise<number | Error> => {
  try {
    const result = await knex(ETablesNames.produto)
      .insert(produto)
      .returning('id');

    if (Array.isArray(result) && typeof result[0] === 'object') {
      return result[0].id;
    }
    if (Array.isArray(result) && typeof result[0] === 'number') {
      return result[0];
    }

    return new Error('Erro ao cadastrar o registro');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao cadastrar o registro');
  }
};