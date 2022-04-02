import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Venue from "App/Models/Venue";
import CreateVenueValidator from "App/Validators/CreateVenueValidator";

export default class VenuesController {
  public async index({ response }: HttpContextContract) {
    let venues = await Venue.all();
    response.ok({
      message: "Success get data venues",
      data: venues,
    });
  }

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

  public async update({ request, response, params }: HttpContextContract) {
    const payload = await request.validate(CreateVenueValidator);
    let venue = await Venue.findOrFail(params.id);
    venue.name = payload.name;
    venue.address = payload.address;
    venue.phone = payload.phone;
    await venue.save();

    response.ok({
      message: "Venue berhasil diperbaharui",
      venueName: venue.name,
    });
  }

  public async destroy({ params, response }: HttpContextContract) {
    let venue = await Venue.findOrFail(params.id);
    await venue.delete();
    response.ok({ message: "Venue berhasil dihapus" });
  }
}
