import { Knex } from 'knex';

export const up = async (knex: Knex) => {
  return knex.schema.createTable('reserva_produto', (table) => {
    table.increments('id').primary();
    table.integer('reserva_id')
      .notNullable()
      .references('id')
      .inTable('reserva')
      .onDelete('CASCADE');
    table.integer('produto_id')
      .notNullable()
      .references('id')
      .inTable('produto')
      .onDelete('CASCADE');
    table.integer('quantidade').notNullable().defaultTo(1);
    table.decimal('preco_unitario', 10, 2).notNullable();
  }).then(() => {
    console.log('# Created table reserva_produto');
  });
};

export const down = async (knex: Knex) => {
  return knex.schema.dropTable('reserva_produto').then(() => {
    console.log('# Dropped table reserva_produto');
  });
};