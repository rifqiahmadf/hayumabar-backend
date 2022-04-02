import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class Verify {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let email = request.input("email");
    let user = await User.findByOrFail("email", email);
    let isVerified = user.is_verified;
    if (isVerified) {
      await next();
    } else {
      return response.unauthorized({
        message: "Mohon verifikasi OTP akun Anda untuk login",
      });
    }
  }
}
