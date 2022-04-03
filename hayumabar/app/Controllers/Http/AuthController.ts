import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import UserValidator from "App/Validators/UserValidator";
import Mail from "@ioc:Adonis/Addons/Mail";
import Database from "@ioc:Adonis/Lucid/Database";

export default class AuthController {
  /**
   * @swagger
   * /api/v1/register:
   *   post:
   *    tags :
   *      - Authentication
   *    description: Endpoint for register new user
   *    requestBody:
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            $ref: '#definitions/User'
   *        application/json:
   *          schema:
   *            $ref: '#definitions/User'
   *    responses:
   *      201:
   *        description: Success register new user
   *      400:
   *        description: Invalid request
   */
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

  /**
   * @swagger
   * /api/v1/login:
   *   post:
   *    tags :
   *      - Authentication
   *    description: Endpoint for login new user
   *    requestBody:
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            type: object
   *            properties:
   *              email:
   *                type: string
   *                example: 'naheedo@gmail.com'
   *              password:
   *                type: string
   *                example: 'baekdo2521'
   *            required:
   *              - email
   *              - password
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              email:
   *                type: string
   *                example: 'naheedo@gmail.com'
   *              password:
   *                type: string
   *                example: 'baekdo2521'
   *            required:
   *              - email
   *              - password
   *    responses:
   *      200:
   *        description: Success login user
   *      400:
   *        description: Invalid request
   *      401:
   *        description: Only user / owner that have Verify OTP can login
   */
  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const userSchema = schema.create({
        email: schema.string(),
        password: schema.string({}, [rules.minLength(6)]),
      });
      const payload = await request.validate({ schema: userSchema });
      const email = payload.email;
      const password = payload.password;
      const token = await auth.use("api").attempt(email, password);
      response.ok({
        message:
          "Login berhasil, silahkan masukkan token berikut ke button authorize di atas",
        token,
      });
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

  /**
   * @swagger
   * /api/v1/otp-verification:
   *   post:
   *    tags :
   *      - Authentication
   *    description: Endpoint for OTP Verification new user
   *    requestBody:
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            type: object
   *            properties:
   *              email:
   *                type: string
   *                example: 'naheedo@gmail.com'
   *              otp_code:
   *                type: string
   *                minLength: 6
   *                example: '225100'
   *            required:
   *              - email
   *              - otp_code
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              email:
   *                type: string
   *                example: 'naheedo@gmail.com'
   *              otp_code:
   *                type: string
   *                minLength: 6
   *                example: '225100'
   *            required:
   *              - email
   *              - otp_code
   *    responses:
   *      200:
   *        description: Success OTP Verification new user
   *      400:
   *        description: Invalid request
   */
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
      return response.ok({
        message: "Berhasil verifikasi OTP, silahkan Login",
      });
    } else {
      return response.badRequest({ message: "Gagal verifikasi OTP" });
    }
  }
}
