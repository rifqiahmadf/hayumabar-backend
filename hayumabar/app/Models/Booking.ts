import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";
import Field from "App/Models/Field";

export default class Booking extends BaseModel {
  /**
   * @swagger
   * definitions:
   *    Booking:
   *      type: object
   *      properties:
   *         play_date_start:
   *           type: string
   *           format: date
   *           example: '2022-09-10 12:00:00'
   *         play_date_end:
   *           type: string
   *           format: date
   *           example: '2022-09-10 14:00:00'
   *         total_players:
   *           type: integer
   *           example: '10'
   *         field_id:
   *           type: integer
   *           example: '1'
   *      required:
   *        - play_date_start
   *        - play_date_end
   *        - total_players
   *        - field_id
   */
  public serializeExtras() {
    return {
      players_count: this.$extras.players_count,
    };
  }

  @column({ isPrimary: true })
  public id: number;

  @column.dateTime()
  public playDateStart: DateTime;

  @column.dateTime()
  public playDateEnd: DateTime;

  @column()
  public totalPlayers: number;

  @column()
  public userId: number;

  @column()
  public fieldId: number;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @belongsTo(() => User)
  public bookingUser: BelongsTo<typeof User>;

  @belongsTo(() => Field)
  public field: BelongsTo<typeof Field>;

  @manyToMany(() => User, {
    pivotTable: "booking_users",
  })
  public players: ManyToMany<typeof User>;
}
