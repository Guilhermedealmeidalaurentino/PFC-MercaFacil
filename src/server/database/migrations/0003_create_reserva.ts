import { Knex } from 'knex';
import { ETablesNames } from '../ETablesNames';

export const up = async (knex: Knex) => {
  return knex.schema.createTable(ETablesNames.reserva, (table) => {
    table.increments('id').primary();
    table.integer('cliente_id')
      .notNullable()
      .references('id')
      .inTable(ETablesNames.usuario)
      .onDelete('CASCADE');
    table.integer('mercado_id')
      .notNullable()
      .references('id')
      .inTable(ETablesNames.mercado)
      .onDelete('CASCADE');
    table.enum('status', ['PENDENTE', 'CONFIRMADA', 'RETIRADA', 'CANCELADA'])
      .notNullable()
      .defaultTo('PENDENTE');
    table.string('codigo_retirada', 8).notNullable().unique();
    table.timestamp('data_reserva').notNullable().defaultTo(knex.fn.now());
    table.timestamp('data_retirada').notNullable();
    table.timestamps(true, true);
  }).then(() => {
    console.log(`# Created table ${ETablesNames.reserva}`);
  });
};

export const down = async (knex: Knex) => {
  return knex.schema.dropTable(ETablesNames.reserva).then(() => {
    console.log(`# Dropped table ${ETablesNames.reserva}`);
  });
};