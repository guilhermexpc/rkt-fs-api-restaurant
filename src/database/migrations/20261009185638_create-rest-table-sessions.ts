import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("rest_tables_sessions", (table) => {
    table.increments("id").primary();
    table.integer("table_id").notNullable().references("id").inTable("restaurant_tables").onDelete("CASCADE");
    table.timestamp("opened_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("closed_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("rest_tables_sessions");
}
