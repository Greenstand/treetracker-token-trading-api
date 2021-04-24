require('dotenv').config()
const request = require('supertest');
const { expect } = require('chai');
const log = require('loglevel');
const chai = require("chai");
const server = require("../../server/app");
chai.use(require('chai-uuid'));
const Zaven = require("../mock-data/Zaven.json");
const Meisze = require("../mock-data/Meisze.json");
const testUtils = require("./testUtils");
const Transfer = require("../../server/models/Transfer");
const TokenA = require("../mock-data/TokenA");

describe('Zaven request to send 1 token to Meisze', () => {
  let registeredZaven;
  let registeredMeisze;
  let transfer;

  beforeEach(async () => {
    await testUtils.clear();
    registeredZaven = await testUtils.registerAndLogin(Zaven);
    await testUtils.addToken(registeredZaven, TokenA);
    expect(registeredZaven).property("id").a("string");
    registeredMeisze = await testUtils.registerAndLogin(Meisze);
    transfer = await testUtils.sendAndPend(registeredZaven,registeredMeisze, 1);
  })

  describe("Meisze decline the request", () => {

    beforeEach(async () => {
      await request(server)
        .post(`/transfers/${transfer.id}/decline`)
        .set('Content-Type', "application/json")
        .set('treetracker-api-key', registeredMeisze.apiKey)
        .set('Authorization', `Bearer ${registeredMeisze.token}`)
        .expect(200);
    });

    it("The transfer status should be cancelled", async () => {

      await request(server)
        .get(`/transfers?limit=1000`)
        .set('treetracker-api-key', registeredMeisze.apiKey)
        .set('Authorization', `Bearer ${registeredMeisze.token}`)
        .expect(200)
        .then(res => {
          expect(res.body.transfers).lengthOf(1);
          expect(res.body.transfers[0]).property("state").eq(Transfer.STATE.cancelled);
        });

    });

    it("Zaven should still have 1 token", async () =>{

      await request(server)
        .get(`/tokens?limit=10`)
        .set('treetracker-api-key', registeredZaven.apiKey)
        .set('Authorization', `Bearer ${registeredZaven.token}`)
        .expect(200)
        .then(res => {
          expect(res.body.tokens).lengthOf(1);
        });
    });
  });

});
