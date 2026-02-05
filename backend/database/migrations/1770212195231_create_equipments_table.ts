import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'equipments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table
        .integer('zone_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('zones')
        .onDelete('CASCADE')
      table.string('type').notNullable()
      table.decimal('capacity_max_mw', 10, 2).notNullable()
      table.integer('importance_weight').notNullable().defaultTo(1)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
