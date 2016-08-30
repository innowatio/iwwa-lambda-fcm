import {map} from "bluebird";
import {isEmpty} from "ramda";

import push from "./services/fcm";
import log from "./services/logger";
import getReceivers from "./steps/get-receivers";

export default async function pipeline (event) {
    const rawElement = event.data;
    if (!rawElement) {
        return null;
    }
    log.debug("Received push notification request", rawElement);
    // Retrieve the user
    const usersId = rawElement.usersId;
    const topic = rawElement.topic;
    if (isEmpty(usersId) && !topic) {
        return null;
    }
    const receivers = await getReceivers(topic, usersId);
    if (!receivers) {
        return null;
    }
    await map(receivers, receiver => push(rawElement, receiver));
    log.info("Pushed notification to all devices", {topic, usersId});
    return null;
}
