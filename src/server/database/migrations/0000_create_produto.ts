import type { Knex } from "knex";
import { ETablesNames } from "../ETablesNames";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(ETablesNames.produto, table => {
      table.bigIncrements('id').primary().index();
      table.string('nome', 150).notNullable();
      table.string('descricao', 500).notNullable();
      table.string('categoria', 100).notNullable();
      table.string('marca', 100).notNullable();
      table.decimal('preco', 10, 2).notNullable();
      table.integer('estoque').notNullable();
      table.boolean('ativo').defaultTo(true);
      table.timestamps(true, true);
    })
    .then(() => {
      console.log(`# Created table ${ETablesNames.produto}`);
    });
}
export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable(ETablesNames.produto)
    .then(() => {
      console.log(`# Dropped table ${ETablesNames.produto}`);
    });
}