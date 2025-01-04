/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

  import Route from '@ioc:Adonis/Core/Route'
  import AuthController from 'App/Controllers/Http/AuthController'
  import ExpensesController from 'App/Controllers/Http/ExpensesController'

  Route.get('/', async () => {
    return { hello: 'world' }
  })

  Route.post('/api/login','AuthController.login')
  Route.post('/api/register', 'AuthController.register') 
  Route.post('/api/logout','AuthController.logout').middleware('auth')  
  Route.post('/expenses', 'ExpensesController.store').middleware('auth')
  Route.get('/expenses', 'ExpensesController.index').middleware('auth')
  Route.delete('/expenses/:id', 'ExpensesController.destroy').middleware('auth')
  Route.patch('/expenses/:id', 'ExpensesController.update').middleware('auth')
  Route.get('/expenses/all', 'ExpensesController.getAllExpenses')
