import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import UserValidator from "App/Validators/UserValidator";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(UserValidator);
      const newUser = await User.create(data);
      response.created({
        message: "Berhasil membuat user/owner baru",
        data: newUser.name,
      });
    } catch (error) {
      response.unprocessableEntity({ message: error.message });
    }
  }
}
