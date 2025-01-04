// contracts/request.ts
import '@ioc:Adonis/Core/Request'

declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    user?: {
      id: number
      email: string
    }
  }
}
