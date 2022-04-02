import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import UserValidator from "App/Validators/UserValidator";
import Mail from "@ioc:Adonis/Addons/Mail";
import Database from "@ioc:Adonis/Lucid/Database";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(UserValidator);
      const newUser = await User.create(data);
      const otp_code = Math.floor(100000 + Math.random() * 900000);
      await Database.table("otp_codes").insert({
        otp_code: otp_code,
        user_id: newUser.id,
      });
      await Mail.send((message) => {
        message
          .from("adonis.demo@sanberdev.com")
          .to(data.email)
          .subject("Welcome Onboard!")
          .htmlView("emails/otp_verification", { otp_code });
      });
      response.created({
        message: "Register success, please verify your otp code in your email",
        data: newUser.name,
      });
    } catch (error) {
      response.unprocessableEntity({ message: error.message });
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const userSchema = schema.create({
        email: schema.string(),
        password: schema.string({}, [rules.minLength(6)]),
      });
      await request.validate({ schema: userSchema });
      const email = request.input("email");
      const password = request.input("password");
      const token = await auth.use("api").attempt(email, password);
      response.ok({ message: "login success", token });
    } catch (error) {
      if (error.guard) {
        return response.badRequest({
          message: "login failed",
          error: error.message,
        });
      } else {
        return response.badRequest({
          message: "login failed",
          error: error.messages,
        });
      }
    }
  }

  public async otpConfirmation({ request, response }: HttpContextContract) {
    let otp_code = request.input("otp_code");
    let email = request.input("email");

    let user = await User.findByOrFail("email", email);
    let otpCheck = await Database.query()
      .from("otp_codes")
      .where("otp_code", otp_code)
      .first();

    if (user.id == otpCheck.user_id) {
      user.is_verified = true;
      await user?.save();
      return response.ok({ message: "Berhasil verifikasi OTP" });
    } else {
      return response.badRequest({ message: "Gagal verifikasi OTP" });
    }
  }
}
