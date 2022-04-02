import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class User {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const authUser = auth.user!;
    if (authUser.role == "user") {
      await next();
    } else {
      return response.unauthorized({
        message: "Hanya user yang dapat mengakses ini",
      });
    }
  }
}
