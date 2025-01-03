import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Expense from 'App/Models/Expense'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Auth from 'App/Middleware/Auth'



export default class ExpensesController {
    public async create({request,response,auth}:HttpContextContract){
        const expenseSchema=schema.create({
            amount:schema.number([rules.unsigned()]),                 
            description: schema.string(),
      category: schema.string(),
      date: schema.date(),
        })
        try{
            const payload=await request.validate({schema:expenseSchema})
            const userId=auth.user?.id
        }
    }
}
