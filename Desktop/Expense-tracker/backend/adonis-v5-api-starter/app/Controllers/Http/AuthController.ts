import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema,rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'




const JWT_SECRET=Env.get('JWT_SECRET')
const JWT_EXPIRES_IN=Env.get('JWT_EXPIRES_IN','1h')

export default class AuthController {


    public async register({ request, response }: HttpContextContract) {
        // Define schema for validating registration data
        const registerSchema = schema.create({
            email: schema.string([rules.email(), rules.unique({ table: 'users', column: 'email' })]),
            password: schema.string([rules.minLength(6)]),
        })

        try {
            // Validate the incoming request data
            const payload = await request.validate({ schema: registerSchema })

            // Create new user and hash the password
            const user = new User()
            user.email = payload.email
            user.password = payload.password // It will be hashed when saved

            await user.save()

            return response.status(201).json({
                message: 'User registered successfully',
                user: { email: user.email },
            })
        } catch (error) {
            console.error('Registration error:', error)
            return response.status(400).json({ message: 'Validation failed' })
        }
    }

    
    public async login({request,response}:HttpContextContract){
        const loginSchema=schema.create({
            email:schema.string([rules.email()]),
            password:schema.string()
        })
        try{
            const payload=await request.validate({schema:loginSchema})
            console.log('Received payload:', payload)
            const user=await User.findBy('email',payload.email)
            console.log('User found:', user)
            if(!user){
                return response.unauthorized({message:'Invalid credentials'})
            }

            const isPasswordValid=await Hash.verify(user.password,payload.password)
            console.log('Password verification result:', isPasswordValid) 
            if(!isPasswordValid){
                return response.unauthorized({message:'Invalid credentials'})
            }
            

            const token=jwt.sign(
                {id:user.id,email:user.email},
                JWT_SECRET,
                {expiresIn:JWT_EXPIRES_IN}
            )
            return response.ok({
                message:'Logged in successfully',
                token,
            })
        }
        catch(error){
            return response.status(500).json({message:'Something went wrong'})
        }
    }


    public async  logout({auth,response}:HttpContextContract){
        try{
            await auth.use('api').revoke()
            return response.ok({message:"logout successful"})
        }
        catch (error) {
            console.error('Logout error:', error);
            return response.internalServerError({ message: 'Failed to logout' });
          }
    }
}
