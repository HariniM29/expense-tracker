import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo } from '@ioc:Adonis/Lucid/Orm'
import { Category } from 'App/types/enum'
export default class Expense extends BaseModel {
  @column({ isPrimary: true })
  public expenseId: number

  @column()
  public amount: number

  @column()
  public description: string

  // @column()
  // public category: string

  @column()
  public category: Category;

  @column.date()
  public date: DateTime

  @column()
  public user_id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User> 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
