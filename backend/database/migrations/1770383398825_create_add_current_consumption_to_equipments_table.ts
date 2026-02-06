import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'equipments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('current_consumption_mw', 10, 2).notNullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('current_consumption_mw')
    })
  }
}
