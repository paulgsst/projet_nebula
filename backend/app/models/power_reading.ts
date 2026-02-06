import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PowerReading extends BaseModel {
  static table = 'power_readings'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare totalConsumptionMw: number

  @column()
  declare totalCapacityMw: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
