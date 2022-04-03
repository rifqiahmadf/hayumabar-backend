import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";
import Field from "./Field";

/**
 * @swagger
 * definitions:
 *    Venue:
 *      type: object
 *      properties:
 *         name:
 *           type: string
 *           example: 'Sasana Olahraga ITB'
 *         address:
 *           type: string
 *           example: 'Bandung'
 *         phone:
 *           type: string
 *           example: '+62858502121'
 *      required:
 *        - name
 *        - address
 *        - phone
 */
export default class Venue extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public address: string;

  @column()
  public phone: string;

  @column()
  public userId: number;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @hasMany(() => Field)
  public fields: HasMany<typeof Field>;
}
