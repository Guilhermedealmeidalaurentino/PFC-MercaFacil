import knex, { Knex } from "knex";
import { ETablesNames } from "../ETablesNames";
import { PasswordCrypto } from "../../shared/services";
export const seed = async (knex: Knex) => {
  console.log('# Seed iniciado');
  
  const adminExistente = await knex(ETablesNames.usuario)
    .where('role', 'ADMIN')
    .first();

  console.log('# Admin existente:', adminExistente);

  if (adminExistente) {
    console.log('# Admin já existe, pulando seed');
    return;
  }

  console.log('# Criando admin...');
  const hashedPassword = await PasswordCrypto.hashPassword('admin123');
  console.log('# Hash gerado:', hashedPassword);

  await knex(ETablesNames.usuario).insert({
    nome: 'Administrador',
    email: 'admin@mercafacil.com',
    senha: hashedPassword,
    role: 'ADMIN',
    ativo: true,
  });
  console.log('# Admin criado com sucesso');
};