import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Venue from "App/Models/Venue";
import Booking from "App/Models/Booking";

/**
 * @swagger
 * definitions:
 *    Field:
 *      type: object
 *      properties:
 *         name:
 *           type: string
 *           example: 'Lapangan Basket ITB'
 *         type:
 *           type: string
 *           enum: [soccer,minisoccer,futsal,basketball,volleyball]
 *           example: 'basketball'
 *      required:
 *        - name
 *        - type
 */
export default class Field extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public type:
    | "futsal"
    | "soccer"
    | "mini soccer"
    | "basketball"
    | "volleyball";

  @column()
  public venueId: number;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @belongsTo(() => Venue)
  public venue: BelongsTo<typeof Venue>;

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>;
}
