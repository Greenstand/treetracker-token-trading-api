/* 
 * The model for: entity, wallet, entity table and so on
 */
const HttpError = require("../utils/HttpError");
const knex = require('../database/knex');
const expect = require("expect-runtime");
const BaseRepository = require("./BaseRepository");

class WalletRepository extends BaseRepository {

  constructor() {
    super("wallets.wallet");
  }

  async create(object){
    const result = await super.create(object);
    expect(result).match({
      id: expect.any(Number),
    });
    return result;
  }

  async getByName(wallet){
    expect(wallet, () => new HttpError(400, `invalid wallet name:${wallet}`))
      .match(/^\S+$/);
    const list = await knex.select().table('wallets.wallet').where('name', wallet);
    expect(list, () => new HttpError(404, `Could not find entity by wallet name: ${wallet}`)).defined().lengthOf(1);
    return list[0];
  }

  async getById(id){
    const object = await knex.select().table('wallets.wallet').where('id', id).first();
    if(!object){
      throw new HttpError(404, `Could not find wallet by id: ${id}`);
    }
    return object;
  }


}

module.exports = WalletRepository;
