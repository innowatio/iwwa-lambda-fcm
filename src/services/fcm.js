import gcm from "node-gcm";

import {GOOGLE_SERVER_API_KEY} from "../config";
import log from "./logger";

export default function push ({data, title, message, type}, receiver) {
    const fcm = gcm(GOOGLE_SERVER_API_KEY);
    var gcmMessage = {
        priority: "high",
        delayWhileIdle: true,
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
    log.debug("Sending notification to devices", receiver);
    log.info("Sending message", gcmMessage);
    // It returns a promise
    return fcm.send(gcmMessage, receiver)
        .then(response => {
            log.info("Pushed notification", response);
            return response;
        }).catch(err => {
            log.error("Error pushing notification", {err});
            return err;
        });
}
