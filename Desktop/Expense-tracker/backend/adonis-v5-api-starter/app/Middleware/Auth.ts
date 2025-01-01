import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'


const JWT_SECRET=Env.get('JWT_SECRET')

export default class Auth {
  public async handle({request,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try{
      const token =request.header('Authorization')?.replace('Bearer', '')
      if(!token){
        return response.unauthorized({message:'Token not provided'})
      }
      const decoded=jwt.verify(token,JWT_SECRET)
      request['user']=decoded
      await next()
    }
    catch(error){
      return response.unauthorized({message:'Invalid or expired token'})
    }
    
  }
}
