import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Expense from 'App/Models/Expense'
import { Category } from 'App/types/enum';
import { TopologyDescription } from 'mongodb';
export default class ExpenseController {

    public async getAllExpenses({ request,response }: HttpContextContract) {
        
        try{
            const page=request.input('page',1)
            const limit=request.input('limit',10);
            const expenses=await Expense.query().paginate(page,limit)
            return response.json({expenses})
        }
        catch(error){
            return response.status(500).json({ message: "An error occurred while retrieving all expenses" });
        }

    }
    
    public async index({request,response}:HttpContextContract){
        try{
            const user=request.user
        if(!user){
            return response.json({message:"User not authenticated"})
        }
        const expenses=await Expense.query().where('user_id',user.id)
        return response.json({expenses})
        }
        catch(error){
            return response.status(500).json({message:"An error occurred while retrieving expenses"})
        }
        
    }


  public async store({ request, response }: HttpContextContract) {
    const expenseData = request.only(['amount', 'description', 'category', 'date'])
    const validCategories: Category[] = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Others'];

if (!validCategories.includes(expenseData.category)) {
  return response.badRequest({ message: 'Invalid category' });
}

    const user = request.user // Retrieve the logged-in user from the request (set by the middleware)
    console.log("User from request:", user);


    try {
      // Check if user exists in the request
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      // Create a new expense for the logged-in user
      const expense = await Expense.create({
        ...expenseData,
        user_id: user.id, // Associate the expense with the logged-in user
      })

      return response.status(201).json({
        message: 'Expense created successfully',
        expense,
      })
    } catch (error) {
      console.error('Error storing expense:', error)
      return response.status(500).json({
        message: 'An error occurred while creating the expense',
      })
    }
  }


  public async destroy({request,response}:HttpContextContract){
    try{
        const user=request.user
        if(!user){
            return response.json({message:"User not authenticated"})
        }
        const expense=await Expense.query().where('user_id',user.id).first()
        if(!expense){
            return response.notFound({message:"Expense not found"})
        }
        await expense.delete();
        return response.json({message:"Expenses deleted successfully"})
    }
    catch(error){
        return response.status(500).json({
            message:"An error occurred while deleting the expense",
            error:error.message
        })
    }
  }

  public async update({request,response}:HttpContextContract){
    const user=request.user
    if(!user){
        return response.json({message:"User not authenticated"})
    }
    const { id } = request.params();
    const expenseData=request.only(['amount','category','description']);
    const expense=await Expense.find(id);
    if(!expense){
        return response.status(400).json({message:"Expense not found"})
    }
    expense.merge(expenseData)
    await expense.save()
    response.status(200).json({message:"Expense updated successfully",expense})
  }
}
