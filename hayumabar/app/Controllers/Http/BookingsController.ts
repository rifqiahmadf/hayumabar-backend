import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Booking from "App/Models/Booking";
import Field from "App/Models/Field";
import User from "App/Models/User";
import Venue from "App/Models/Venue";
import CreateBookingValidator from "App/Validators/CreateBookingValidator";

export default class BookingsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ request, response, auth, params }: HttpContextContract) {
    const payload = await request.validate(CreateBookingValidator);
    const authUser = auth.user!;
    const user = await User.findByOrFail("id", authUser.id);
    const field = await Field.findByOrFail("id", payload.field_id);
    const venue = await Venue.findByOrFail("id", params.venue_id);
    const booking = new Booking();
    booking.playDateStart = payload.play_date_start;
    booking.playDateEnd = payload.play_date_end;
    booking.totalPlayers = payload.total_players;
    booking.fieldId = payload.field_id;
    booking.userId = authUser.id;

    if (field.venueId == venue.id) {
      user.related("bookings").save(booking);
      response.ok({ message: "berhasil melakukan booking" });
    } else {
      response.notFound({
        message: "field yang anda pilih bukan pada venue ini",
      });
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
