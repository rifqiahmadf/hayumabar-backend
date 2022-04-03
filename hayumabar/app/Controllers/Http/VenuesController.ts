import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Venue from "App/Models/Venue";
import CreateVenueValidator from "App/Validators/CreateVenueValidator";

export default class VenuesController {
  /**
   * @swagger
   * /api/v1/venues/:
   *   get:
   *    security:
   *      - bearerAuth: []
   *    tags :
   *      - Venue
   *    description: Endpoint for get all data venues
   *    responses:
   *      200:
   *        description: Success get all data venues
   *      400:
   *        description: Invalid request
   */
  public async index({ response }: HttpContextContract) {
    let venues = await Venue.query().select("*").preload("fields");
    response.ok({
      message: "Berhasil mendapatkan semua data venues",
      data: venues,
    });
  }

  /**
   * @swagger
   * /api/v1/venues:
   *   post:
   *    security:
   *      - bearerAuth: []
   *    tags :
   *      - Venue
   *    description: Endpoint for store venue
   *    requestBody:
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            $ref: '#definitions/Venue'
   *        application/json:
   *          schema:
   *            $ref: '#definitions/Venue'
   *    responses:
   *      201:
   *        description: Success store data venues
   *      400:
   *        description: Invalid request
   *      401:
   *        description: Only owner can access this route
   */
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

  /**
   * @swagger
   * /api/v1/venues/{id}:
   *   get:
   *    security:
   *      - bearerAuth: []
   *    tags :
   *      - Venue
   *    description: Endpoint for get venue by venue ID
   *    parameters:
   *      - name: id
   *        description: Venue ID
   *        in: path
   *        required: true
   *        schema:
   *            type: integer
   *            minimum: 1
   *            example: 1
   *    responses:
   *      200:
   *        description: Success get data venues by venue ID
   *      400:
   *        description: Invalid request
   */
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

  /**
   * @swagger
   * /api/v1/venues/{id}:
   *   put:
   *    security:
   *      - bearerAuth: []
   *    tags :
   *      - Venue
   *    description: Endpoint for update venue
   *    parameters:
   *      - name: id
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
   *            $ref: '#definitions/Venue'
   *        application/json:
   *          schema:
   *            $ref: '#definitions/Venue'
   *    responses:
   *      200:
   *        description: Success update venue
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
    const user = auth.user!;
    const cekVenue = await Venue.findByOrFail("id", params.id);

    if (user.id == cekVenue.userId) {
      const payload = await request.validate(CreateVenueValidator);

      let venue = await Venue.query()
        .where("user_id", user.id)
        .andWhere("id", params.id)
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

  /**
   * @swagger
   * /api/v1/venues/{id}:
   *   delete:
   *    security:
   *      - bearerAuth: []
   *    tags :
   *      - Venue
   *    description: Endpoint for update venue (Make sure to remove all fields related to this Venue before Delete)
   *    parameters:
   *      - name: id
   *        description: Venue ID
   *        in: path
   *        required: true
   *        schema:
   *            type: integer
   *            minimum: 1
   *            example: 1
   *    responses:
   *      200:
   *        description: Success delete venue
   *      400:
   *        description: Invalid request
   *      401:
   *        description: Only owner can access this route
   */
  public async destroy({ auth, params, response }: HttpContextContract) {
    const user = auth.user!;
    const venue = await Venue.findOrFail(params.id);

    if (user.id == venue.userId) {
      await venue.delete();
      response.ok({
        message: `Venue dengan ID: ${venue.id} telah berhasil dihapus`,
      });
    }
  }
}
