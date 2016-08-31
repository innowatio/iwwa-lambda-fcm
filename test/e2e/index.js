import {map} from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import {repeat} from "ramda";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import {USER_COLLECTION} from "config";
import fcm from "services/fcm";
import {handler} from "index";
import {getEventFromObject, run} from "../mock";
import mongodb from "services/mongodb";

describe("`On notification`", () => {

    const context = {
        succeed: sinon.spy(),
        fail: sinon.spy()
    };

    class Message {

        constructor () {
            this.message = {};
        }

        addNotification (notification) {
            this.message = {...this.message, notification};
        }

        addData (data) {
            this.message = {...this.message, data};
        }

    }

    const send = sinon.spy();

    class Sender {

        send (message, receiver) {
            return send(message, receiver);
        }

    }

    const gcm = {
        Message,
        Sender
    };

    var userCollection;
    var db;

    before(async () => {
        fcm.__Rewire__("gcm", gcm);
        db = await mongodb;
        await db.createCollection(USER_COLLECTION);
    });

    after(async () => {
        fcm.__ResetDependency__("gcm");
        await db.dropCollection(USER_COLLECTION);
    });

    beforeEach(async () => {
        userCollection = db.collection(USER_COLLECTION);
        userCollection.remove();
        context.succeed.reset();
        context.fail.reset();
        send.reset();
    });

    const getEvent = element => ({
        id: "eventId",
        data: {
            element,
            id: "d0f7c9b4-ef6b-45c8-b216-723e78a6fe72"
        },
        type: "element inserted in collection notifications"
    });

    it("not send push notification if are not present usersId and topic", async () => {
        const element = {
            title: "title",
            message: "message",
            type: "type"
        };
        const event = getEventFromObject(getEvent(element));
        await run(handler, event);
        expect(send).to.have.callCount(0);
    });

    it("send FCM push notification to topic", async () => {
        const element = {
            title: "title",
            message: "message",
            topic: "topic",
            type: "type"
        };
        const event = getEventFromObject(getEvent(element));
        await run(handler, event);
        expect(send).to.have.callCount(1);
        expect(send).to.have.calledWithExactly({
            message: {
                notification: {
                    title: "title",
                    body: "message",
                    icon: "ic_launcher",
                    sound: "default",
                    badge: "1",
                    tag: "type"
                }
            }
        }, {topic: "topic"});
    });

    it("send FCM push notification to topic [CASE: usersId and topic selected]", async () => {
        const element = {
            title: "title",
            message: "message",
            topic: "topic",
            type: "type",
            usersId: ["usersId"]
        };
        const event = getEventFromObject(getEvent(element));
        await run(handler, event);
        expect(send).to.have.callCount(1);
        expect(send).to.have.calledWithExactly({
            message: {
                notification: {
                    title: "title",
                    body: "message",
                    icon: "ic_launcher",
                    sound: "default",
                    badge: "1",
                    tag: "type"
                }
            }
        }, {topic: "topic"});
    });

    it("send FCM push notification to topic [CASE: payload with data]", async () => {
        const element = {
            title: "title",
            message: "message",
            topic: "topic",
            type: "type",
            data: {
                data1: "data1",
                data2: "data2"
            }
        };
        const event = getEventFromObject(getEvent(element));
        await run(handler, event);
        expect(send).to.have.callCount(1);
        expect(send).to.have.calledWithExactly({
            message: {
                notification: {
                    title: "title",
                    body: "message",
                    icon: "ic_launcher",
                    sound: "default",
                    badge: "1",
                    tag: "type"
                },
                data: {
                    data1: "data1",
                    data2: "data2"
                }
            }
        }, {topic: "topic"});
    });

    it("send FCM push notification to usersId", async () => {
        const element = {
            title: "title",
            message: "message",
            type: "type",
            usersId: ["user1", "user2"],
            data: {
                data1: "data1",
                data2: "data2"
            }
        };
        await userCollection.insert({_id: "user1", services: {fcm: {token: "token1"}}});
        await userCollection.insert({_id: "user2", services: {fcm: {token: "token2"}}});
        const event = getEventFromObject(getEvent(element));
        await run(handler, event);
        expect(send).to.have.callCount(1);
        expect(send).to.have.calledWithExactly({
            message: {
                notification: {
                    title: "title",
                    body: "message",
                    icon: "ic_launcher",
                    sound: "default",
                    badge: "1",
                    tag: "type"
                },
                data: {
                    data1: "data1",
                    data2: "data2"
                }
            }
        }, {registrationTokens: ["token1", "token2"]});
    });

    it("send FCM push notification to usersId [CASE: users without token]", async () => {
        const element = {
            title: "title",
            message: "message",
            type: "type",
            usersId: ["user1", "user2"],
            data: {
                data1: "data1",
                data2: "data2"
            }
        };
        await userCollection.insert({_id: "user1"});
        await userCollection.insert({_id: "user2"});
        const event = getEventFromObject(getEvent(element));
        await run(handler, event);
        expect(send).to.have.callCount(0);
    });

    it("send FCM push notification to usersId [CASE: users not exist]", async () => {
        const element = {
            title: "title",
            message: "message",
            type: "type",
            usersId: ["user1", "user2"],
            data: {
                data1: "data1",
                data2: "data2"
            }
        };
        const event = getEventFromObject(getEvent(element));
        await run(handler, event);
        expect(send).to.have.callCount(0);
    });

    it("send FCM push notification to usersId [CASE: user with and without token]", async () => {
        const element = {
            title: "title",
            message: "message",
            type: "type",
            usersId: ["user1", "user2"],
            data: {
                data1: "data1",
                data2: "data2"
            }
        };
        await userCollection.insert({_id: "user1"});
        await userCollection.insert({_id: "user2", services: {fcm: {token: "token"}}});
        const event = getEventFromObject(getEvent(element));
        await run(handler, event);
        expect(send).to.have.callCount(1);
        expect(send).to.have.calledWithExactly({
            message: {
                notification: {
                    title: "title",
                    body: "message",
                    icon: "ic_launcher",
                    sound: "default",
                    badge: "1",
                    tag: "type"
                },
                data: {
                    data1: "data1",
                    data2: "data2"
                }
            }
        }, {registrationTokens: ["token"]});
    });


    it("send FCM push notification to usersId [CASE: more than 1000 user]", async () => {
        const users = repeat(1, 2100).map((a, index) => `user${index}`);
        const tokens = repeat(1, 2100).map((a, index) => `token${index}`);
        const element = {
            title: "title",
            message: "message",
            type: "type",
            usersId: users,
            data: {
                data1: "data1",
                data2: "data2"
            }
        };
        await map(users, async (user, index) => {
            await userCollection.insert({
                _id: user,
                services: {fcm: {token: `token${index}`}
            }});
        });
        const event = getEventFromObject(getEvent(element));
        await run(handler, event);
        expect(send).to.have.callCount(3);
        expect(send.firstCall).to.have.calledWithExactly({
            message: {
                notification: {
                    title: "title",
                    body: "message",
                    icon: "ic_launcher",
                    sound: "default",
                    badge: "1",
                    tag: "type"
                },
                data: {
                    data1: "data1",
                    data2: "data2"
                }
            }
        }, {registrationTokens: tokens.slice(0, 1000)});
        expect(send.secondCall).to.have.calledWithExactly({
            message: {
                notification: {
                    title: "title",
                    body: "message",
                    icon: "ic_launcher",
                    sound: "default",
                    badge: "1",
                    tag: "type"
                },
                data: {
                    data1: "data1",
                    data2: "data2"
                }
            }
        }, {registrationTokens: tokens.slice(1000, 2000)});
        expect(send.thirdCall).to.have.calledWithExactly({
            message: {
                notification: {
                    title: "title",
                    body: "message",
                    icon: "ic_launcher",
                    sound: "default",
                    badge: "1",
                    tag: "type"
                },
                data: {
                    data1: "data1",
                    data2: "data2"
                }
            }
        }, {registrationTokens: tokens.slice(2000, 2100)});
    });

});
