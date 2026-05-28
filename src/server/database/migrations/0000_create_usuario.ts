import type { Knex } from "knex";
import { ETablesNames } from "../ETablesNames";

export async function up(knex: Knex) {
  return knex.schema.createTable('usuario', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('email').notNullable().unique();
    table.string('senha').notNullable();
    table.string('telefone').nullable();
    table.enum('role', ['ADMIN', 'CLIENTE', 'MERCADO']).notNullable().defaultTo('CLIENTE');
    table.boolean('ativo').notNullable().defaultTo(true);
  }).then(() => {
    console.log(`# Created table ${ETablesNames.usuario}`);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETablesNames.usuario).then(() => {
    console.log(`# Dropped table ${ETablesNames.usuario}`);
  });
}