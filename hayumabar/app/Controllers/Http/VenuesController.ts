import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Venue from "App/Models/Venue";
import CreateVenueValidator from "App/Validators/CreateVenueValidator";

export default class VenuesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(CreateVenueValidator);
    const authUser = auth.user;
    const newVenue = await Venue.create({
      name: payload.name,
      address: payload.address,
      phone: payload.phone,
      user_id: authUser?.id,
    });
    response.created({
      message: "Venue berhasil dibuat",
      venueName: newVenue.name,
    });
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
