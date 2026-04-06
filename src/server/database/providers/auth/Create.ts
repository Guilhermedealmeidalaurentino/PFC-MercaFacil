import { Knex } from "../../knex";
import { ETablesNames } from "../../ETablesNames";
import { IUsuario } from "../../models";

export const create = async (
  usuario: Omit<IUsuario, 'id'>
): Promise<number | Error> => {

  try {

    const result = await Knex(ETablesNames.usuario)
      .insert({
        email: usuario.email,
        senha: usuario.senha
      });

    return result[0];

  } catch (error) {
    console.log(error);
    return new Error('Erro ao cadastrar usuário');
  }
};