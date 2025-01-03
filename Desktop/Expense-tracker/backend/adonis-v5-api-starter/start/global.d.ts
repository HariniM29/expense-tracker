

console.log('Global declarations loaded');
declare module '@ioc:Adonis/Core/HttpContext' {
    interface HttpContextContract {
      user: { id: number; email: string } | null
    }
  }
  