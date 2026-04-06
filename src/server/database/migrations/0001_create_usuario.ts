import type { Knex } from "knex";
import { ETablesNames } from "../ETablesNames";


export async function up(knex: any) {
  return knex.schema.createTable('usuario', (table: any) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('senha').notNullable();
    }).then(()=>{
        console.log(`# Created table ${ETablesNames.usuario}`); 
    })

}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(ETablesNames.usuario)
  .then(()=>{
        console.log(`# Dropped table ${ETablesNames.usuario}`); 
    })


}


