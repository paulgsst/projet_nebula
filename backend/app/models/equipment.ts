import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Zone from './zone.js'

export default class Equipment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare zoneId: number

  @column()
  declare type: string

  @column()
  declare capacityMaxMw: number

  @column()
  declare importanceWeight: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Zone)
  declare zone: BelongsTo<typeof Zone>
}
