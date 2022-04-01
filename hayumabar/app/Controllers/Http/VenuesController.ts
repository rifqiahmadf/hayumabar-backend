import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Venue from "App/Models/Venue";
import CreateVenueValidator from "App/Validators/CreateVenueValidator";

export default class VenuesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateVenueValidator);
    const newVenue = await Venue.create({
      name: payload.name,
      address: payload.address,
      phone: payload.phone,
    });
    response.created({
      message: "Venue berhasil dibuat",
      id: newVenue.id,
    });
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
