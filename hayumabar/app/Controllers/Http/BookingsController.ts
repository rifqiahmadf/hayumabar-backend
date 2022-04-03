import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Booking from "App/Models/Booking";
import Field from "App/Models/Field";
import Venue from "App/Models/Venue";
import CreateBookingValidator from "App/Validators/CreateBookingValidator";

export default class BookingsController {
  public async index({ response }: HttpContextContract) {
    const bookings = await Booking.query().select("*").preload("field");
    response.ok({
      message: "Berhasil get all data booking",
      data: bookings,
    });
  }

  public async store({ request, response, auth, params }: HttpContextContract) {
    const payload = await request.validate(CreateBookingValidator);
    const user = auth.user!;
    const field = await Field.findByOrFail("id", payload.field_id);
    const venue = await Venue.findByOrFail("id", params.venue_id);

    if (field.venueId == venue.id) {
      const booking = new Booking();
      booking.playDateStart = payload.play_date_start;
      booking.playDateEnd = payload.play_date_end;
      booking.totalPlayers = payload.total_players;
      booking.fieldId = payload.field_id;
      booking.userId = user.id;
      user.related("bookings").save(booking);
      response.created({ message: "berhasil melakukan booking" });
    } else {
      response.notFound({
        message: "field yang anda pilih bukan pada venue ini",
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    const data = await Booking.query()
      .where("id", params.id)
      .select("*")
      .preload("players")
      .withCount("players")
      .firstOrFail();
    response.ok({
      message: "Berhasil get all data booking",
      data: data,
    });
  }

  public async update({
    auth,
    response,
    request,
    params,
  }: HttpContextContract) {
    const payload = await request.validate(CreateBookingValidator);
    const user = auth.user!;
    const booking = await Booking.findOrFail(params.id);
    if (user.id == booking.userId) {
      booking.playDateStart = payload.play_date_start;
      booking.playDateEnd = payload.play_date_end;
      booking.totalPlayers = payload.total_players;
      booking.fieldId = payload.field_id;
      await booking.save();
      return response.ok({
        message: "Booking berhasil diperbaharui",
      });
    } else {
      return response.unauthorized({
        message: "Kamu tidak dapat mengakses ini",
      });
    }
  }

  public async destroy({ auth, response, params }: HttpContextContract) {
    const user = auth.user!;
    const booking = await Booking.findOrFail(params.id);
    if (user.id == booking.userId) {
      await booking.delete();
      response.ok({ message: "Booking berhasil dihapus" });
    }
  }

  public async join({ auth, response, params }: HttpContextContract) {
    const user = auth.user!;
    const booking = await Booking.findOrFail(params.id);
    const data = await Booking.query()
      .where("id", params.id)
      .withCount("players")
      .firstOrFail();
    const players_count = data.$extras.players_count;
    if (players_count <= booking.totalPlayers) {
      await booking.related("players").attach([user.id]);
      return response.ok({ message: "berhasil join" });
    } else {
      return response.badRequest({
        message: "mohon maaf tidak bisa join jadwal ini",
      });
    }
  }

  public async unjoin({ auth, response, params }: HttpContextContract) {
    const user = auth.user!;
    const booking = await Booking.findOrFail(params.id);
    await booking.related("players").detach([user.id]);
    response.ok({ message: "berhasil unjoin" });
  }

  public async schedules({ auth, response }: HttpContextContract) {
    const authUser = auth.user!;
    let userBookSchedule = await User.query()
      .where("id", authUser.id)
      .select("*")
      .preload("bookingSchedule", (bookingQuery) => {
        bookingQuery.preload("field").withCount("players");
      });

    response.ok({
      message:
        "Berhasil mendapatkan semua schedules dari user yang sedang login",
      data: userBookSchedule,
    });
  }
}
