const expect = require('expect-runtime');
const knex = require('../database/knex');
const config = require('../../config/config');
const HttpError = require('../utils/HttpError');
const BaseRepository = require('./BaseRepository');
const Session = require('../models/Session');

class TokenRepository extends BaseRepository {
  constructor(session) {
    super('token', session);
    this._tableName = 'token';
    this._session = session;
  }

  async getById(id) {
    const result = await this._session
      .getDB()(this._tableName)
      .where('id', id)
      .first();
    expect(
      result,
      () => new HttpError(404, `can not found token by id:${id}`),
    ).match({
      id: expect.any(String),
    });
    return result;
  }

  /*
   * select transaction table by transfer id, return matched tokens
   */
  async getByTransferId(transferId, limit, offset = 0) {
    return await this._session.getDB().raw(`
      SELECT "token".* FROM "token"
      JOIN "transaction" 
      ON "token".id = "transaction".token_id
      WHERE "transaction".transfer_id = ${transferId}
      LIMIT ${limit}
      OFFSET ${offset}`);
  }
}

module.exports = TokenRepository;
