import { PasswordCrypto } from '../../../shared/services';
import { ETablesNames } from '../../ETablesNames';
import { IUsuario } from '../../models';
import { Knex } from '../../knex';

export const create = async (
  usuario: Omit<IUsuario, 'id'>
): Promise<number | Error> => {
  try {
    const usuarioExistente = await Knex(ETablesNames.usuario)
      .where('email', usuario.email)
      .first();

    if (usuarioExistente) {
      return new Error('Email já cadastrado');
    }

    const hashedPassword = await PasswordCrypto.hashPassword(usuario.senha);

    const [result] = await Knex(ETablesNames.usuario)
      .insert({
        nome: usuario.nome,
        email: usuario.email,
        senha: hashedPassword,
        cpf: usuario.cpf ?? undefined,
        telefone: usuario.telefone ?? undefined,
        role: usuario.role,
        ativo: usuario.ativo,
      })
      .returning('id');

    if (typeof result === 'object') return result.id;
    if (typeof result === 'number') return result;

    return new Error('Erro ao cadastrar usuário');
  } catch (error) {
    console.log(error);
    return new Error('Erro ao cadastrar usuário');
  }
};