import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CreateFieldValidator from "App/Validators/CreateFieldValidator";
import Venue from "App/Models/Venue";
import Field from "App/Models/Field";

export default class FieldsController {
  public async index({ response, params }: HttpContextContract) {
    let fields = await Field.query()
      .where("venue_id", params.venue_id)
      .select("*");
    return response.ok({ message: "success", fields });
  }

  public async create({}: HttpContextContract) {}

  public async store({ auth, request, response, params }: HttpContextContract) {
    const payload = await request.validate(CreateFieldValidator);
    const user = auth.user!;
    const cekVenue = await Venue.findByOrFail("id", params.venue_id);

    if (user.id == cekVenue.userId) {
      let newField = new Field();
      newField.name = payload.name;
      newField.type = payload.type;
      newField.venueId = params.venue_id;

      await newField.save();

      return response.created({ message: "Field telah berhasil dibuat" });
    } else {
      return response.unauthorized({
        message: "Kamu tidak dapat mengakses ini",
      });
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const field = await Field.query()
      .where("id", params.id)
      .preload("venue")
      .preload("bookings", (bookingQuery) => {
        bookingQuery.select([
          "id",
          "field_id",
          "play_date_start",
          "play_date_end",
          "user_id",
        ]);
      })
      .firstOrFail();
    response.ok({ message: "success", data: field });
  }

  public async edit({}: HttpContextContract) {}

  public async update({
    auth,
    request,
    response,
    params,
  }: HttpContextContract) {
    const payload = await request.validate(CreateFieldValidator);
    const user = auth.user!;
    const venue = await Venue.findOrFail(params.venue_id);

    if (user.id == venue.userId) {
      let field = await Field.query()
        .where("id", params.id)
        .andWhere("venue_id", params.venue_id)
        .select("*")
        .firstOrFail();
      field.name = payload.name;
      field.type = payload.type;
      await field.save();
      return response.ok({
        message: "Field telah diperbaharui",
      });
    }
  }

  public async destroy({ auth, response, params }: HttpContextContract) {
    const user = auth.user!;
    const venue = await Venue.findOrFail(params.venue_id);

    if (user.id == venue.userId) {
      let field = await Field.query()
        .where("id", params.id)
        .andWhere("venue_id", params.venue_id)
        .select("*")
        .firstOrFail();

      await field.delete();
      return response.ok({ message: "Field telah dihapus" });
    }
  }
}
