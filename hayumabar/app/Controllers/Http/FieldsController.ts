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

  public async store({ request, response, params }: HttpContextContract) {
    const payload = await request.validate(CreateFieldValidator);
    const venue = await Venue.findOrFail(params.venue_id);

    await venue?.related("fields").create({
      name: payload.name,
      type: payload.type,
    });
    response.created({
      message: "Field berhasil dibuat",
      fieldName: payload.name,
    });
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({ request, response, params }: HttpContextContract) {
    const payload = await request.validate(CreateFieldValidator);
    let field = await Field.query()
      .where("id", params.id)
      .andWhere("venue_id", params.venue_id)
      .select("*")
      .firstOrFail();
    field.name = payload.name;
    field.type = payload.type;
    await field.save();
    response.ok({
      message: "Field telah diperbaharui",
      updatedFieldName: field.name,
    });
  }

  public async destroy({ response, params }: HttpContextContract) {
    let field = await Field.query()
      .where("id", params.id)
      .andWhere("venue_id", params.venue_id)
      .select("*")
      .firstOrFail();

    await field.delete();
    response.ok({ message: "Field telah dihapus" });
  }
}
