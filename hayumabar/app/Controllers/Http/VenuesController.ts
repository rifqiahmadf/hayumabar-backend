import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Venue from "App/Models/Venue";
import CreateVenueValidator from "App/Validators/CreateVenueValidator";

export default class VenuesController {
  public async index({ response }: HttpContextContract) {
    let venues = await Venue.query().select("*").preload("fields");
    response.ok({
      message: "Berhasil mendapatkan semua data venues",
      data: venues,
    });
  }

  public async create({}: HttpContextContract) {}

  public async store({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(CreateVenueValidator);
    const user = auth.user!;

    const newVenue = await Venue.create({
      name: payload.name,
      address: payload.address,
      phone: payload.phone,
      userId: user.id,
    });
    response.created({
      message: "Venue telah berhasil dibuat",
      venueName: newVenue.name,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    let venue = await Venue.query()
      .select("*")
      .preload("fields", (fieldQuery) => {
        fieldQuery.preload("bookings");
      })
      .where("id", params.id)
      .firstOrFail();

    response.ok({
      message: "Berhasil mendapatkan data venue dan fields venue",
      data: venue,
    });
  }

  public async edit({}: HttpContextContract) {}

  public async update({
    auth,
    request,
    response,
    params,
  }: HttpContextContract) {
    const user = auth.user!;
    const cekVenue = await Venue.findByOrFail("id", params.id);

    if (user.id == cekVenue.userId) {
      const payload = await request.validate(CreateVenueValidator);

      let venue = await Venue.query()
        .where("user_id", user.id)
        .andWhere("id", params.venue_id)
        .select("*")
        .firstOrFail();

      venue.name = payload.name;
      venue.address = payload.address;
      venue.phone = payload.phone;

      await venue.save();

      return response.ok({
        message: `Venue dengan ID: ${venue.id} telah berhasil diperbaharui`,
      });
    } else {
      return response.unauthorized({
        message: "Kamu tidak dapat mengakses ini",
      });
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const user = auth.user!;
    const venue = await Venue.findOrFail(params.id);

    if (user.id == venue.userId) {
      await venue.delete();
      response.ok({ message: "Venue berhasil dihapus" });
    }
  }
}
