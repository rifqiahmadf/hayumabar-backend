import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Fields extends BaseSchema {
  protected tableName = "fields";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.enu("type", [
        "futsal",
        "soccer",
        "mini soccer",
        "basketball",
        "volleyball",
      ]);
      table
        .integer("venue_id")
        .unsigned()
        .references("venues.id")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
