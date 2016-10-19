import {map} from "bluebird";
import {isEmpty} from "ramda";

import push from "./services/fcm";
import log from "./services/logger";
import getReceivers from "./steps/get-receivers";

export default async function pipeline (event) {
    const rawElement = event.data.element;
    if (!rawElement) {
        return null;
    }
    log.debug(rawElement, "Received push notification request");
    // Retrieve the user
    const usersId = rawElement.usersId;
    const topic = rawElement.topic;
    if (isEmpty(usersId) && !topic) {
        log.info("SKIP EMPTY USER OR TOPIC");
        return null;
    }
    const receivers = await getReceivers(topic, usersId);
    if (!receivers) {
        log.info("SKIP EMPTY RECEIVER");
        return null;
    }
    await map(receivers, receiver => push(rawElement, receiver));
    log.info({topic, usersId}, "Pushed notification to all devices");
    return null;
}
