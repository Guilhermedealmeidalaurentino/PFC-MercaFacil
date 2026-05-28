import { Knex } from 'knex';
import { ETablesNames } from '../ETablesNames';

export const up = async (knex: Knex) => {
  return knex.schema.createTable(ETablesNames.mercado, (table) => {
    table.increments('id').primary();
    table.integer('usuario_id')
      .notNullable()
      .references('id')
      .inTable(ETablesNames.usuario)
      .onDelete('CASCADE');
    table.string('nome_mercado').notNullable();
    table.string('cnpj').notNullable().unique();
    table.string('cep').notNullable();
    table.string('logradouro').nullable();
    table.string('bairro').nullable();
    table.string('cidade').nullable();
    table.string('estado', 2).nullable();
    table.text('descricao').nullable();
    table.boolean('ativo').defaultTo(true);
    table.time('horario_abertura').notNullable().defaultTo('08:00:00');
    table.time('horario_fechamento').notNullable().defaultTo('18:00:00');
  }).then(() => {
    console.log(`# Created table ${ETablesNames.mercado}`);
  });
};

export const down = async (knex: Knex) => {
  return knex.schema.dropTable(ETablesNames.mercado).then(() => {
    console.log(`# Dropped table ${ETablesNames.mercado}`);
  });
};