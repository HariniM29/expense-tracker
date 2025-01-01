import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
// import { Hash } from '@adonisjs/core/build/standalone'
import Hash from '@ioc:Adonis/Core/Hash' 
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email:string

  @column()
  public password:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  public async save(){
    if(this.$dirty.password){
      this.password=await Hash.make(this.password)
    }
    return super.save()
  }
}
