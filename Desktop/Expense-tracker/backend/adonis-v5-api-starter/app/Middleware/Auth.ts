  import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  import jwt,{JwtPayload} from 'jsonwebtoken'
  import Env from '@ioc:Adonis/Core/Env'
  import BlacklistedToken from 'App/Models/BlacklistedToken'


  const JWT_SECRET=Env.get('JWT_SECRET')

  export default class Auth {
    public async handle({request,response}: HttpContextContract, next: () => Promise<void>) {
    const authHeader=request.header('Authorization')
    if(!authHeader?.startsWith('Bearer')){
      return response.unauthorized({message:"Authorization header must start with Bearer"})

    }

      try{
        // const token =request.header('Authorization')?.replace('Bearer', '')
        const token = authHeader.replace('Bearer ', '').trim()
        if(!token){
          return response.unauthorized({message:'Token not provided'})
        }
    

        const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload & { id: number; email: string }
        console.log("decoded",decoded)
        const isBlacklisted=await BlacklistedToken.findBy('token',token)
        if(isBlacklisted){
          return response.json({message:"Token is blacklisted"})
        }

        request['user']=decoded

        console.log("test",request['user'])
        await next()
      }
      catch(error){
        console.error("token verification error",error)
        if(error.name==='TokenExpiredError'){
          return response.unauthorized({message:"Token has been expired"})
        }
        else if(error.name==='JsonWebTokenError'){
          return response.unauthorized({message:"Invalid token"});

        }
        else{
          return response.unauthorized({message:"Unauthorized access"})
        }
      
    }
  }
  }
