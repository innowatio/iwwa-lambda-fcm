import {map} from "bluebird";
import {isEmpty, without, splitEvery} from "ramda";

import {USER_COLLECTION} from "config";
import mongodb from "services/mongodb";
import getTokenId from "./get-token-id";

export default async function getReceivers (topic, usersId) {
    var receiver = [];
    if (topic) {
        receiver = [topic];
    } else if (usersId) {
        const db = await mongodb;
        const users = await map(usersId, userId =>
            db.collection(USER_COLLECTION).findOne({_id: userId})
        );
        const tokensId = without([null], users.map(getTokenId));
        receiver = splitEvery(1000, tokensId);
    }
    return isEmpty(receiver) ? null : receiver;
};
