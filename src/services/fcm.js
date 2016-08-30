import gcm from "node-gcm";

import {GOOGLE_SERVER_API_KEY} from "../config";
import log from "./logger";

export default function push ({data, title, message, type}, receiver) {
    const gcmMessage = new gcm.Message({
        priority: "high",
        delayWhileIdle: true
    });
    log.debug("Sending notification to devices", receiver);
    const sender = new gcm.Sender(GOOGLE_SERVER_API_KEY);
    gcmMessage.addNotification({
        title,
        body: message,
        icon: "ic_launcher",
        sound: "default",
        badge: "1",
        tag: type
    });
    data ? gcmMessage.addData(data) : null;
    // It returns a promise
    return sender.send(gcmMessage, receiver);
}
