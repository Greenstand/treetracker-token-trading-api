const TrustService = require("./TrustService");
const WalletService = require("./WalletService");
const Wallet = require("../models/Wallet");
const jestExpect = require("expect");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
const {expect} = chai;
const uuid = require('uuid');

describe("TrustService", () => {
  const trustService = new TrustService();

  describe("", () => {
  });

  afterEach(() => {
    sinon.restore();
  });

  /*
   *{
    "actor_wallet_id": 10,
    "target_wallet_id": 11,
    "type": "send",
    "originator_wallet_id": 10,
    "request_type": "send",
    "state": null,
    "created_at": "2020-10-16T07:36:21.955Z",
    "updated_at": "2020-10-16T07:36:21.955Z",
    "active": null,
    "id": 4062
}
   */
  it("convertToResponse", async () => {
    const trustId1 = uuid.v4();
    const walletId1 = uuid.v4();
    const trustObject = {
      "actor_wallet_id": 10,
      "target_wallet_id": 11,
      "type": "send",
      "originator_wallet_id": 10,
      "request_type": "send",
      "state": "trusted",
      "created_at": "2020-10-16T07:36:21.955Z",
      "updated_at": "2020-10-16T07:36:21.955Z",
      "active": null,
      "id": trustId1,
    }
    sinon.stub(WalletService.prototype, "getById").resolves(new Wallet({
      id: walletId1,
      name: "testName",
    }));
    const result = await trustService.convertToResponse(trustObject);
    expect(result).deep.eq({
      "id": trustId1,
      "actor_wallet": "testName",
      "target_wallet": "testName",
      "originating_wallet": "testName",
      "type": "send",
      "state": "trusted",
      "request_type": "send",
      "created_at": "2020-10-16T07:36:21.955Z",
      "updated_at": "2020-10-16T07:36:21.955Z",
    });
  });
});
