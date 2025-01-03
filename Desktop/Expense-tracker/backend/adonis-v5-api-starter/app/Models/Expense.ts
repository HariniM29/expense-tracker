import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo } from '@ioc:Adonis/Lucid/Orm'
export default class Expense extends BaseModel {
  @column({ isPrimary: true })
  public expenseId: number

  @column()
  public amount: number

  @column()
  public description: string

  @column()
  public category: string

  @column.date()
  public date: DateTime

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User> 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
