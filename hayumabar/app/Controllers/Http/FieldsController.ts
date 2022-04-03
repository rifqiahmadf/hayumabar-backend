import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CreateFieldValidator from "App/Validators/CreateFieldValidator";
import Venue from "App/Models/Venue";
import Field from "App/Models/Field";

export default class FieldsController {
  /**
   * @swagger
   * /api/v1/venues/{venue_id}/fields:
   *   get:
   *    security:
   *      - bearerAuth: []
   *    tags :
   *      - Field
   *    description: Endpoint for get all data field
   *    parameters:
   *      - name: venue_id
   *        description: Venue ID
   *        in: path
   *        required: true
   *        schema:
   *            type: integer
   *            minimum: 1
   *            example: 1
   *    responses:
   *      200:
   *        description: Success get all data field
   *      400:
   *        description: Invalid request
   */
  public async index({ response, params }: HttpContextContract) {
    let fields = await Field.query()
      .where("venue_id", params.venue_id)
      .select("*");
    return response.ok({ message: "success", fields });
  }

  /**
   * @swagger
   * /api/v1/venues/{venue_id}/fields:
   *   post:
   *    security:
   *      - bearerAuth: []
   *    tags :
   *      - Field
   *    description: Endpoint for store field
   *    parameters:
   *      - name: venue_id
   *        description: Venue ID
   *        in: path
   *        required: true
   *        schema:
   *            type: integer
   *            minimum: 1
   *            example: 1
   *    requestBody:
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            $ref: '#definitions/Field'
   *        application/json:
   *          schema:
   *            $ref: '#definitions/Field'
   *    responses:
   *      201:
   *        description: Success store data field
   *      400:
   *        description: Invalid request
   *      401:
   *        description: Only owner can access this route
   */
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

  /**
   * @swagger
   * /api/v1/venues/{venue_id}/fields/{id}:
   *   get:
   *    security:
   *      - bearerAuth: []
   *    tags :
   *      - Field
   *    description: Endpoint for get field by Venue ID and Field ID
   *    parameters:
   *      - name: venue_id
   *        description: Venue ID
   *        in: path
   *        required: true
   *        schema:
   *            type: integer
   *            minimum: 1
   *            example: 1
   *      - name: id
   *        description: Field ID
   *        in: path
   *        required: true
   *        schema:
   *            type: integer
   *            minimum: 1
   *            example: 1
   *    responses:
   *      200:
   *        description: Success get field by Venue ID and Field ID
   *      400:
   *        description: Invalid request
   */
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

  /**
   * @swagger
   * /api/v1/venues/{venue_id}/fields/{id}:
   *   put:
   *    security:
   *      - bearerAuth: []
   *    tags :
   *      - Field
   *    description: Endpoint for update field
   *    parameters:
   *      - name: venue_id
   *        description: Venue ID
   *        in: path
   *        required: true
   *        schema:
   *            type: integer
   *            minimum: 1
   *            example: 1
   *      - name: id
   *        description: Field ID
   *        in: path
   *        required: true
   *        schema:
   *            type: integer
   *            minimum: 1
   *            example: 1
   *    requestBody:
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            $ref: '#definitions/Field'
   *        application/json:
   *          schema:
   *            $ref: '#definitions/Field'
   *    responses:
   *      200:
   *        description: Success update data field
   *      400:
   *        description: Invalid request
   *      401:
   *        description: Only owner can access this route
   */
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

  /**
   * @swagger
   * /api/v1/venues/{venue_id}/fields/{id}:
   *   delete:
   *    security:
   *      - bearerAuth: []
   *    tags :
   *      - Field
   *    description: Endpoint for delete field
   *    parameters:
   *      - name: venue_id
   *        description: Venue ID
   *        in: path
   *        required: true
   *        schema:
   *            type: integer
   *            minimum: 1
   *            example: 1
   *      - name: id
   *        description: Field ID
   *        in: path
   *        required: true
   *        schema:
   *            type: integer
   *            minimum: 1
   *            example: 1
   *    responses:
   *      200:
   *        description: Success delete data field
   *      400:
   *        description: Invalid request
   *      401:
   *        description: Only owner can access this route
   */
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
