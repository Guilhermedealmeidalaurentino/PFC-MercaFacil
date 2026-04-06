
import { ETablesNames } from "../../ETablesNames";
import { IUsuario } from "../../models";
import { Knex } from '../../knex';

export const login = async (
  email: string,
  senha: string
): Promise<Omit<IUsuario, 'senha'> | Error> => {

  try {

    const result = await Knex(ETablesNames.usuario)
      .select('*')
      .where('email', email)
      .first();

    if (!result) {
      return new Error('Usuário não encontrado');
    }

    if (result.senha !== senha) {
      return new Error('Senha inválida');
    }

    const { senha: _, ...usuarioSemSenha } = result;

    return usuarioSemSenha;

  } catch (error) {
    console.log(error);
    return new Error('Erro ao realizar login');
  }
};