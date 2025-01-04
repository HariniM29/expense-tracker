import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'expenses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('expense_id')
      table.float('amount')
      table.string('description')
      // table.string('category') 
      table.enu('category', ['Food', 'Transport', 'Entertainment', 'Utilities', 'Others']).notNullable()
      table.date('date')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps(true, true)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
