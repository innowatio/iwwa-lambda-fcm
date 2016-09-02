import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";
chai.use(chaiAsPromised);
chai.use(sinonChai);

import {USER_COLLECTION} from "config";
import mongodb from "services/mongodb";
import getReceivers from "steps/get-receivers";

describe("`getReceivers` function", () => {

    const getTokenId = sinon.stub();
    var db;

    before(async () => {
        db = await mongodb;
        getReceivers.__Rewire__("getTokenId", getTokenId);
        await db.createCollection(USER_COLLECTION);
    });

    after(async () => {
        getReceivers.__ResetDependency__(getTokenId);
        await db.dropCollection(USER_COLLECTION);
    });

    beforeEach(() => {
        getTokenId.reset();
    });

    it("returns topic as receiver if is set topic as input", async () => {
        const topic = "topic";
        const ret = await getReceivers(topic);
        expect(ret).to.deep.equal([topic]);
    });

    it("returns topic as receiver if are set usersId and topic as input]", async () => {
        const topic = "topic";
        const usersId = ["userId"];
        const ret = await getReceivers(topic, usersId);
        expect(ret).to.deep.equal([topic]);
    });

    it("returns a registrationTokens array as receivers if is set usersId as input [CASE: getTokenId returns the token]", async () => {
        db.collection(USER_COLLECTION).insert({_id: "userId"});
        db.collection(USER_COLLECTION).insert({_id: "anotherUserId"});
        const usersId = ["userId", "anotherUserId"];
        getTokenId.returns("token");
        const ret = await getReceivers(null, usersId);
        expect(ret).to.deep.equal([["token", "token"]]);
    });

    it("returns a null if is set usersId as input [CASE: getTokenId returns undefined for all users]", async () => {
        db.collection(USER_COLLECTION).insert({_id: "userId"});
        db.collection(USER_COLLECTION).insert({_id: "anotherUserId"});
        const usersId = ["userId", "anotherUserId"];
        getTokenId.returns(null);
        const ret = await getReceivers(null, usersId);
        expect(ret).to.deep.equal(null);
    });

});
