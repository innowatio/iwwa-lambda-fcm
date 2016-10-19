import gcm from "node-gcm";

import {GOOGLE_SERVER_API_KEY} from "../config";
import log from "./logger";

export default function push ({data, title, message, type}, receiver) {
    const fcm = gcm(GOOGLE_SERVER_API_KEY);
    var gcmMessage = {
        priority: "high",
        notification: {
            title,
            body: message,
            icon: "ic_launcher",
            sound: "default",
            badge: "1",
            tag: type
        }
    };
    if (data) {
        gcmMessage = {
            ...gcmMessage,
            data
        };
    }
    log.debug(receiver, "Sending notification to devices");
    log.info(gcmMessage, "Sending message");
    // It returns a promise
    return fcm.send(gcmMessage, receiver)
        .then(response => log.info(response, "Pushed notification"))
        .catch(err => log.error({err}, "Error pushing notification"));
}
